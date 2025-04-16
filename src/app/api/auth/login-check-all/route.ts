import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import pool from "@/lib/db";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get('user');
        
        if (!userCookie?.value) {
            return NextResponse.json({ error: "Không tìm thấy phiên đăng nhập" }, { status: 401 });
        }

        const user = JSON.parse(userCookie.value);
        
        // Cập nhật scl_logtimeout cho phiên đăng nhập hiện tại
        await pool.query(
            `UPDATE sys_check_login 
             SET scl_logtimeout = CURRENT_TIMESTAMP
             WHERE scl_userid = $1 
             AND scl_computername = $2
             AND scl_trangthai = 'I'`,
            [user.username, user.computerName]
        );

        return NextResponse.json({ success: true });
        
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái hoạt động:', error);
        return NextResponse.json(
            { error: "Có lỗi xảy ra khi cập nhật trạng thái hoạt động" },
            { status: 500 }
        );
    }
} 