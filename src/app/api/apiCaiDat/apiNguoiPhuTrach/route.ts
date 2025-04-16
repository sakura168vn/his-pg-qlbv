import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query(
      'SELECT su_userid, su_name FROM sys_user WHERE su_isactive = \'Y\' ORDER BY su_name'
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching nguoi phu trach:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 