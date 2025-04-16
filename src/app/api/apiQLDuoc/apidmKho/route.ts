import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = `
        SELECT 
          dmkho_ma AS ma_kho, 
          dmkho_ten AS ten_kho,
          dmloai_ten AS loai_kho, 
          sd_name AS ten_khoa,
          dmkho_trangthai AS trang_thai
        FROM qlduoc_dmkho 
        LEFT JOIN qlduoc_dmloai ON dmkho_loai = dmloai_ma
        LEFT JOIN sys_dept ON sd_id = dmkho_khoa
        WHERE dmkho_trangthai = 'Y'
        ORDER BY dmkho_id;
    `;
    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching DMKho:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ma_kho, ten_kho, loai_kho, khoa } = body;

    // Kiểm tra mã kho đã tồn tại chưa
    const checkQuery = `
      SELECT dmkho_ma FROM qlduoc_dmkho WHERE dmkho_ma = $1
    `;
    const checkResult = await pool.query(checkQuery, [ma_kho]);
    
    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Mã kho đã tồn tại' },
        { status: 400 }
      );
    }

    // Thêm kho mới
    const insertQuery = `
      INSERT INTO qlduoc_dmkho (
        dmkho_ma,
        dmkho_ten,
        dmkho_loai,
        dmkho_khoa,
        dmkho_trangthai
      ) VALUES ($1, $2, $3, $4, 'Y')
      RETURNING *;
    `;

    const result = await pool.query(insertQuery, [
      ma_kho,
      ten_kho,
      loai_kho,
      khoa
    ]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating kho:', error);
    return NextResponse.json(
      { error: 'Lỗi khi thêm kho mới' },
      { status: 500 }
    );
  }
}
