import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Các route được phép truy cập công khai
const publicRoutes = [
  "/login",
  "/api/auth/login",
  "/api/auth/login-check-status",
  "/_next",
  "/static",
  "/icons",
  "/images"
];

// Các route không cần kiểm tra session
const excludedRoutes = [
  "/api/",  // Bỏ qua tất cả các API routes
  "/_next/", 
  "/static/",
  "/icons/",
  "/images/"
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const userCookie = request.cookies.get('user');

  // Kiểm tra xem path có phải là public route không
  const isPublicRoute = publicRoutes.some(route => 
    path === route || path.startsWith(route + "/")
  );

  // Nếu đã đăng nhập và cố truy cập trang login
  if (userCookie && path === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Nếu chưa đăng nhập và cố truy cập các trang được bảo vệ
  if (!userCookie && !isPublicRoute) {
    // Cho phép truy cập API routes cần thiết
    if (path.startsWith('/api/auth/')) {
      return NextResponse.next();
    }

    // Chuyển hướng về trang login với thông báo
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set('show-login-message', 'error', {
      path: '/',
      maxAge: 5 // Cookie tồn tại 5 giây
    });
    return response;
  }

  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các route cần thiết
export const config = {
  matcher: [
    '/((?!api/auth/login|api/auth/login-check-status|_next/static|_next/image|favicon.ico).*)',
  ]
}; 