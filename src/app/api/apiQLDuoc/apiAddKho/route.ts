import { NextResponse } from "next/server";
import pool from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { dmkho_ma, dmkho_ten, dmkho_loai, dmkho_khoa, dmkho_trangthai } = body;

        // Kiểm tra xem mã kho đã tồn tại chưa
        const existingKho = await pool.query(
            'SELECT * FROM qlduoc_dmkho WHERE dmkho_ma = $1',
            [dmkho_ma]
        );

        if (existingKho.rows.length > 0) {
            return NextResponse.json(
                { message: 'Mã kho đã tồn tại trong hệ thống' },
                { status: 400 }
            );
        }

        // Thêm kho mới
        const result = await pool.query(
            `INSERT INTO qlduoc_dmkho (
                dmkho_ma, 
                dmkho_ten, 
                dmkho_loai,
                dmkho_khoa,
                dmkho_trangthai
            ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [dmkho_ma, dmkho_ten, dmkho_loai, dmkho_khoa, dmkho_trangthai]
        );

        return NextResponse.json({            
            data: result.rows[0]
        });

    } catch (error: any) {
        console.error('Lỗi khi thêm kho:', error);
        return NextResponse.json(
            { message: 'Có lỗi xảy ra khi thêm kho' },
            { status: 500 }
        );
    }
} 