import { NextResponse } from "next/server";
import { headers } from 'next/headers';
import pool from "@/lib/db";
import { layIPTenMay } from '@/utils/layIPTenMay';

// Định nghĩa các loại lỗi
const AUTH_ERRORS = {
  MISSING_CREDENTIALS: 'MISSING_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ACCOUNT_INACTIVE: 'ACCOUNT_INACTIVE',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  ALREADY_LOGGED_IN: 'ALREADY_LOGGED_IN',
  SYSTEM_ERROR: 'SYSTEM_ERROR'
};

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        {
          error: "Vui lòng nhập đầy đủ thông tin đăng nhập",
          errorCode: AUTH_ERRORS.MISSING_CREDENTIALS
        },
        { status: 200 }
      );
    }

    // 1. Kiểm tra tài khoản tồn tại
    const checkUserExists = await pool.query(
      `SELECT su_userid, su_isactive 
       FROM sys_user 
       WHERE su_userid = $1`,
      [username]
    );

    if (checkUserExists.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Tài khoản đăng nhập không tồn tại!",
          errorCode: AUTH_ERRORS.USER_NOT_FOUND
        },
        { status: 200 }
      );
    }

    // 2. Kiểm tra trạng thái hoạt động (active)
    const userStatus = checkUserExists.rows[0];
    if (userStatus.su_isactive === 'N') {
      return NextResponse.json(
        {
          error: "Tài khoản đã ngừng hoạt động!",
          errorCode: AUTH_ERRORS.ACCOUNT_INACTIVE
        },
        { status: 200 }
      );
    }

    // 3. Kiểm tra xem người dùng đã đăng nhập ở máy nào chưa
    const { computerName } = layIPTenMay();
    const checkActiveSession = await pool.query(
      `SELECT scl_computername, scl_logindate, scl_check_loginall
       FROM sys_check_login 
       WHERE scl_userid = $1 
       AND scl_isactive = 'I'`,
      [username]
    );

    if (checkActiveSession.rows.length > 0) {
      const activeSession = checkActiveSession.rows[0];
      const lastActivity = new Date(activeSession.scl_check_loginall || activeSession.scl_logindate);
      const now = new Date();
      const inactiveMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

      // Nếu thời gian không hoạt động > 30 phút, tự động logout phiên cũ
      if (inactiveMinutes > 30) {
        await pool.query(
          `UPDATE sys_check_login 
           SET scl_isactive = 'N', 
               scl_logoutdate = $2
           WHERE scl_userid = $1 
           AND scl_isactive = 'I'`,
          [username, lastActivity]
        );
      } else if (activeSession.scl_computername !== computerName) {
        return NextResponse.json(
          {
            error: `Tài khoản đang đăng nhập tại máy ${activeSession.scl_computername}!`,
            errorCode: AUTH_ERRORS.ALREADY_LOGGED_IN
          },
          { status: 200 }
        );
      }
    }

    // 4. Kiểm tra mật khẩu
    const result = await pool.query(
      `SELECT 
          su_userid AS ten_dang_nhap,
          su_name AS ten_nguoi_dung,
          su_password AS mat_khau,
          su_password_mh AS mat_khau_mh,
          su_deptid AS ma_khoa,
          su_tel AS so_dien_thoai,
          su_isactive
      FROM sys_user 
      WHERE su_userid = $1 
      AND su_password_mh = crypt($2, su_password_mh)`,
      [username, password]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Mật khẩu không chính xác!",
          errorCode: AUTH_ERRORS.INVALID_PASSWORD
        },
        { status: 200 }
      );
    }

    const user = result.rows[0];
    const { clientIP } = layIPTenMay();

    // Lấy department_id của user
    const userDeptResult = await pool.query(
      `SELECT su_deptid 
       FROM sys_user 
       WHERE su_userid = $1`,
      [user.ten_dang_nhap]
    );
    
    const department_id = userDeptResult.rows[0].su_deptid;

    // Cập nhật hoặc tạo phiên đăng nhập mới
    // Đầu tiên set tất cả các phiên cũ thành không hoạt động
    await pool.query(
      `UPDATE sys_check_login 
       SET scl_isactive = 'N', 
           scl_logoutdate = CURRENT_TIMESTAMP
       WHERE scl_userid = $1 
       AND scl_isactive = 'I'`,
      [username]
    );

    // Sau đó tạo phiên mới
    await pool.query(
      `INSERT INTO sys_check_login (
        scl_userid,
        scl_department_id,
        scl_ipaddress,
        scl_computername,
        scl_logindate,
        scl_isactive,
        scl_check_loginall
      ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 'I', CURRENT_TIMESTAMP)`,
      [user.ten_dang_nhap, department_id, clientIP, computerName]
    );

    // Trả về thông tin người dùng
    const response = NextResponse.json(
      {
        user: {
          username: user.ten_dang_nhap,
          name: user.ten_nguoi_dung,
          ma_khoa: user.ma_khoa,
          so_dien_thoai: user.so_dien_thoai || null,
          computerName,
          clientIP,
          defaultPath: '/admin'
        }
      },
      { status: 200 }
    );

    // Thiết lập cookie cho phiên đăng nhập
    response.cookies.set({
      name: 'user',
      value: JSON.stringify({
        username: user.ten_dang_nhap,
        name: user.ten_nguoi_dung,
        ma_khoa: user.ma_khoa,
        computerName
      }),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60
    });

    return response;

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return NextResponse.json(
      {
        error: "Có lỗi xảy ra trong quá trình đăng nhập",
        errorCode: AUTH_ERRORS.SYSTEM_ERROR
      },
      { status: 500 }
    );
  }
} 