import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    //console.log('API: Fetching data from database...');
    
    // Kiểm tra kết nối database
    try {
      await pool.query('SELECT 1');
      //console.log('API: Database connection successful');
    } catch (dbError) {
      //console.error('API: Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database Connection Error', 
        details: String(dbError) 
      }, { status: 500 });
    }
    
    const query = `
        SELECT 
            dmloai_ma AS ma_loai, 
            dmloai_ten AS ten_loai
        FROM qlduoc_dmloai 
        ORDER BY dmloai_ma;
    `;
    //console.log('API: Executing query:', query);
    
    const result = await pool.query(query);
    //console.log('API: Query result rows count:', result.rows.length);
    
    if (result.rows.length === 0) {
      console.log('API: No data found in the table');
      return NextResponse.json({ 
        message: 'No data found', 
        rows: [] 
      });
    }
    
    //console.log('API: First few rows:', result.rows.slice(0, 3));
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching DMLoai:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: String(error) 
    }, { status: 500 });
  }
}
