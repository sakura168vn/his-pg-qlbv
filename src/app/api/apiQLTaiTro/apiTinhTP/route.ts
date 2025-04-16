import { NextResponse } from 'next/server';
import pool from "@/lib/db";

export async function GET() {
  try {
    const client = await pool.connect();
    const query = `
      SELECT 
        sp_id as value,
        sp_name as label
      FROM sys_prov 
      WHERE sp_active = 'Y'
      ORDER BY sp_name ASC
    `;
    
    const result = await client.query(query);
    client.release();

    return NextResponse.json({
      status: 200,
      data: result.rows
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      status: 500,
      message: 'Lỗi khi lấy danh sách tỉnh thành phố'
    });
  }
} 