import { NextResponse } from "next/server";
import pool from "@/lib/db";
import NodeCache from 'node-cache';
import { RateLimiter } from 'limiter';

// Cache với thời gian sống là 15 phút thay vì 5 phút
const loginStatusCache = new NodeCache({ stdTTL: 900 });

// Rate limit: 20 requests per minute
const limiter = new RateLimiter({
    tokensPerInterval: 20,
    interval: "minute"
});

export async function POST(req: Request) {
    try {
        // Kiểm tra rate limit
        const hasToken = await limiter.tryRemoveTokens(1);
        if (!hasToken) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            );
        }

        const { username, computerName } = await req.json();
        const cacheKey = `${username}-${computerName}`;

        // Kiểm tra cache trước
        const cachedStatus = loginStatusCache.get(cacheKey);
        if (cachedStatus !== undefined) {
            return NextResponse.json({
                isLoggedIn: cachedStatus,
                fromCache: true
            });
        }

        // Tối ưu query bằng cách chỉ lấy 1 record
        const result = await pool.query(
            `SELECT * FROM sys_check_login 
             WHERE scl_userid = $1 
             AND scl_computername = $2 
             AND scl_isactive = 'I'`,
            [username, computerName]
        );

        const isLoggedIn = result.rows.length > 0;
        
        // Lưu kết quả vào cache
        loginStatusCache.set(cacheKey, isLoggedIn);

        return NextResponse.json({
            isLoggedIn,
            fromCache: false
        });
    } catch (error) {
        console.error('Lỗi kiểm tra trạng thái đăng nhập:', error);
        return NextResponse.json(
            { isLoggedIn: false, error: true },
            { status: 500 }
        );
    }
} 