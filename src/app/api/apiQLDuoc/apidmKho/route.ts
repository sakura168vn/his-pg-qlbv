import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const trangThai = searchParams.get('trangThai') || 'Y';
        const tenKho = searchParams.get('tenKho');

        let queryParams = [trangThai];
        let query = `
            SELECT 
                dmkho_ma AS ma_kho, 
                CAST(dmkho_ten AS TEXT) AS ten_kho,
                dmloai_ten AS loai_kho, 
                sd_name AS ten_khoa,
                dmkho_trangthai AS trang_thai
            FROM qlduoc_dmkho 
            LEFT JOIN qlduoc_dmloai ON dmkho_loai = dmloai_ma
            LEFT JOIN sys_dept ON sd_id = dmkho_khoa
            WHERE dmkho_trangthai = $1
        `;

        if (tenKho) {
            queryParams.push(`%${tenKho}%`);
            query += ` AND LOWER(dmkho_ten) LIKE LOWER($${queryParams.length})`;
        }

        query += ` ORDER BY dmkho_ma`;

        const result = await pool.query(query, queryParams);
        return NextResponse.json(result.rows, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Có lỗi xảy ra khi tải dữ liệu' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { dmkho_ma, dmkho_ten, dmkho_loai, dmkho_khoa, dmkho_trangthai } = body;

        // Kiểm tra các trường bắt buộc
        if (!dmkho_ma || !dmkho_ten || !dmkho_loai || !dmkho_khoa) {
            return NextResponse.json(
                { message: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
                { status: 400 }
            );
        }

        // Kiểm tra định dạng dữ liệu
        if (typeof dmkho_ma !== 'string' || typeof dmkho_ten !== 'string' || 
            typeof dmkho_loai !== 'string' || typeof dmkho_khoa !== 'string') {
            return NextResponse.json(
                { message: 'Định dạng dữ liệu không hợp lệ' },
                { status: 400 }
            );
        }

        // Kiểm tra độ dài và loại bỏ khoảng trắng thừa
        const trimmedMa = dmkho_ma.trim();
        const trimmedTen = dmkho_ten.trim();
        const trimmedLoai = dmkho_loai.trim();
        const trimmedKhoa = dmkho_khoa.trim();

        if (!trimmedMa || !trimmedTen || !trimmedLoai || !trimmedKhoa) {
            return NextResponse.json(
                { message: 'Các trường không được chỉ chứa khoảng trắng' },
                { status: 400 }
            );
        }

        // Kiểm tra mã kho đã tồn tại chưa
        const checkQuery = `
            SELECT dmkho_ma FROM qlduoc_dmkho WHERE dmkho_ma = $1
        `;
        const checkResult = await pool.query(checkQuery, [trimmedMa]);
        
        if (checkResult.rows.length > 0) {
            return NextResponse.json(
                { message: 'Mã kho đã tồn tại' },
                { status: 400 }
            );
        }

        // Thêm kho mới với dữ liệu đã được validate
        const insertQuery = `
            INSERT INTO qlduoc_dmkho (
                dmkho_ma,
                dmkho_ten,
                dmkho_loai,
                dmkho_khoa,
                dmkho_trangthai
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const result = await pool.query(insertQuery, [
            trimmedMa,
            trimmedTen,
            trimmedLoai,
            trimmedKhoa,
            dmkho_trangthai || 'Y' // Mặc định là 'Y' nếu không được cung cấp
        ]);

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating kho:', error);
        return NextResponse.json(
            { message: 'Lỗi khi thêm kho mới' },
            { status: 500 }
        );
    }
}
