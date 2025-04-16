import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const query = `
            SELECT 
                sd_id AS ma_khoa, 
                sd_name AS ten_khoa 
            FROM sys_dept 
            WHERE sd_isactive = 'Y' 
            ORDER BY sd_name;
        `;
        const result = await pool.query(query);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching khoa:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 