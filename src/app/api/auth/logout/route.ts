import { NextResponse } from 'next/server';
import pool from "@/lib/db";
import { layIPTenMay } from '@/utils/layIPTenMay';

export async function POST(req: Request) {
    try {
        const { username } = await req.json();
        
        // Lấy thông tin hệ thống
        const { computerName } = layIPTenMay();

        // Cập nhật thời gian đăng xuất trong sys_check_login
        const logoutResult = await pool.query(
            `UPDATE sys_check_login 
             SET scl_logoutdate = CURRENT_TIMESTAMP,
                 scl_trangthai = 'N'
             WHERE scl_userid = $1 
             AND scl_computername = $2 
             AND scl_trangthai = 'I'
             RETURNING *`,
            [username, computerName]
        );

        if (logoutResult.rows.length === 0) {
            return NextResponse.json(
                {
                    error: "Không tìm thấy phiên đăng nhập hoạt động",
                },
                { status: 404 }
            );
        }

        // Xóa cookie
        const response = NextResponse.json(
            {
                message: "Đăng xuất thành công",
                logoutTime: logoutResult.rows[0].scl_logoutdate
            },
            { status: 200 }
        );
        
        response.cookies.delete('user');
        
        return response;

    } catch (error) {
        console.error("Lỗi đăng xuất:", error);
        return NextResponse.json(
            {
                error: "Có lỗi xảy ra trong quá trình đăng xuất"
            },
            { status: 500 }
        );
    }
} 