import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST() {
    try {
        // Cập nhật các phiên không hoạt động quá 30 phút
        const result = await pool.query(
            `UPDATE sys_check_login 
             SET scl_trangthai = 'N',
                 scl_logoutdate = scl_logtimeout
             WHERE scl_trangthai = 'I'
             AND (EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - scl_logtimeout)) / 60) > 30
             RETURNING scl_userid, scl_computername`
        );

        return NextResponse.json({ 
            success: true,
            message: `Đã cập nhật ${result.rowCount} phiên không hoạt động`,
            updatedSessions: result.rows
        });
        
    } catch (error) {
        console.error('Lỗi khi cleanup phiên không hoạt động:', error);
        return NextResponse.json(
            { error: "Có lỗi xảy ra khi cleanup phiên không hoạt động" },
            { status: 500 }
        );
    }
} 