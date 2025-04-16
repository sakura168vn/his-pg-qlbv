import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let query = `
      SELECT 
        sd_id AS ma_khoa,
        sd_name AS ten_khoa,
        sd_type AS loai_khoa,
        sd_isactive AS trang_thai
      FROM sys_dept 
      WHERE sd_isactive = 'Y'
    `;

    if (search) {
      query += ` AND (
        LOWER(sd_id) LIKE LOWER($1) OR 
        LOWER(sd_name) LIKE LOWER($1)
      )`;
    }

    query += ` ORDER BY sd_name`;

    const result = await db.query(
      query,
      search ? [`%${search}%`] : []
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching khoa data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 