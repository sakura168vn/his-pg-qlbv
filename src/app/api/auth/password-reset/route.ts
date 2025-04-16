import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { adminUsername, userIdToReset } = await req.json();

        // Kiểm tra quyền admin
        if (adminUsername !== 'admin') {
            return NextResponse.json({ 
                error: 'Không có quyền thực hiện thao tác này',
                errorCode: 'PERMISSION_DENIED'
            });
        }

        // Kiểm tra tài khoản tồn tại
        const checkUser = await pool.query(
            `SELECT su_userid FROM sys_user WHERE su_userid = $1`,
            [userIdToReset]
        );

        if (checkUser.rows.length === 0) {
            return NextResponse.json({ 
                error: 'Tài khoản không tồn tại trong hệ thống',
                errorCode: 'USER_NOT_FOUND'
            });
        }

        // Reset mật khẩu về mặc định (123)
        await pool.query(
            `UPDATE sys_user 
             SET su_password_mh = crypt($2, gen_salt('bf'))
             WHERE su_userid = $1`,
            [userIdToReset, '123']
        );

        return NextResponse.json({ 
            success: true,
            message: 'Reset mật khẩu thành công'
        });
    } catch (error) {
        console.error('Lỗi reset mật khẩu:', error);
        return NextResponse.json({ 
            error: 'Có lỗi xảy ra khi reset mật khẩu',
            errorCode: 'SYSTEM_ERROR'
        }, { status: 500 });
    }
} 