import { NextResponse } from 'next/server';
import pool from "@/lib/db";
import NodeCache from 'node-cache';

// Cache với thời gian sống là 1 giờ
const deptCache = new NodeCache({ stdTTL: 3600 });
const CACHE_KEY = 'departments';

export async function GET() {
  try {
    // Kiểm tra cache
    const cachedData = deptCache.get(CACHE_KEY);
    if (cachedData) {
      return NextResponse.json({
        status: 200,
        data: cachedData,
        fromCache: true
      });
    }

    const client = await pool.connect();
    const query = `
      SELECT 
        sd_index_stt AS stt, 
        sd_id AS ma_khoa, 
        sd_name AS ten_khoa 
      FROM sys_dept 
      WHERE sd_isactive = 'Y' 
      AND sd_index_stt > 0 
      ORDER BY sd_index_stt
    `;
    
    const result = await client.query(query);
    client.release();

    // Lưu vào cache
    deptCache.set(CACHE_KEY, result.rows);

    return NextResponse.json({
      status: 200,
      data: result.rows,
      fromCache: false
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({
      status: 500,
      error: 'Internal Server Error'
    });
  }
} 