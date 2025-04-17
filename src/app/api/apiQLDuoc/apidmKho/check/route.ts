import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const ma = searchParams.get('ma');

        if (!ma) {
            return NextResponse.json(
                { message: 'Thiếu mã kho' },
                { status: 400 }
            );
        }

        // Kiểm tra mã kho đã tồn tại
        const checkQuery = `
            SELECT dmkho_ma FROM qlduoc_dmkho WHERE dmkho_ma = $1
        `;
        const result = await pool.query(checkQuery, [ma.trim()]);
        
        return NextResponse.json({
            exists: result.rows.length > 0
        });
    } catch (error) {
        console.error('Error checking kho:', error);
        return NextResponse.json(
            { message: 'Có lỗi xảy ra khi kiểm tra mã kho' },
            { status: 500 }
        );
    }
} 