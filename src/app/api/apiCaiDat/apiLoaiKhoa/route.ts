import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query(
      'SELECT slk_ma, slk_ten FROM sys_loai_khoa WHERE slk_isactive = \'Y\' ORDER BY slk_index'
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching loai khoa:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 