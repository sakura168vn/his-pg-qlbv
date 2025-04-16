import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { username, oldPassword, newPassword } = await req.json();

        // Kiểm tra mật khẩu cũ
        const checkPassword = await pool.query(
            `SELECT su_userid 
             FROM sys_user 
             WHERE su_userid = $1 
             AND su_password_mh = crypt($2, su_password_mh)`,
            [username, oldPassword]
        );

        if (checkPassword.rows.length === 0) {
            return NextResponse.json({ 
                error: 'Mật khẩu cũ không chính xác!',
                errorCode: 'INVALID_PASSWORD'
            });
        }

        // Cập nhật mật khẩu mới
        await pool.query(
            `UPDATE sys_user 
             SET su_password_mh = crypt($2, gen_salt('bf'))
             WHERE su_userid = $1`,
            [username, newPassword]
        );

        return NextResponse.json({ 
            success: true,
            message: 'Thay đổi mật khẩu thành công'
        });
    } catch (error) {
        console.error('Lỗi thay đổi mật khẩu:', error);
        return NextResponse.json({ 
            error: 'Có lỗi xảy ra khi thay đổi mật khẩu',
            errorCode: 'SYSTEM_ERROR'
        }, { status: 500 });
    }
} 