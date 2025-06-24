import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'

// ✅ Các route không cần đăng nhập
const publicRoutes = [
    "/auth/register",
    "/auth/login",
];

// ✅ Các route dành riêng cho SUPER_ADMIN
const superAdminRoutes = [
    '/super-admin',
    '/super-admin/:path*'
];

// ✅ Các route dành cho user thường
const userRoutes = ["/home"];

export async function middleware(request: NextRequest) {
    // ✅ Lấy accessToken từ cookies
    const accessToken = request.cookies.get('accessToken')?.value;

    // ✅ Lấy đường dẫn hiện tại
    const { pathname } = request.nextUrl;

    // ✅ Nếu có token
    if (accessToken) {
        try {
            // ✅ Giải mã và xác thực JWT
            const { payload } = await jose.jwtVerify(
                accessToken,
                new TextEncoder().encode(process.env.JWT_SECRET)
            );

            const { role } = payload as { role: string };

            // ✅ Nếu đã đăng nhập rồi mà cố truy cập /login hoặc /register → chuyển hướng
            if (publicRoutes.includes(pathname)) {
                return NextResponse.redirect(
                    new URL(role === 'SUPER_ADMIN' ? '/super-admin' : '/home', request.url)
                );
            }

            // ✅ SUPER_ADMIN không được vào route dành cho user
            if (
                role === 'SUPER_ADMIN' &&
                userRoutes.some((route) => pathname.startsWith(route))
            ) {
                return NextResponse.redirect(new URL('/super-admin', request.url));
            }

            // ✅ USER không được vào route dành cho SUPER_ADMIN
            if (
                role !== 'SUPER_ADMIN' &&
                superAdminRoutes.some((route) => pathname.startsWith(route))
            ) {
                return NextResponse.redirect(new URL('/home', request.url));
            }

            // ✅ Nếu hợp lệ → cho đi tiếp
            return NextResponse.next();
        } catch (error) {
            console.error('Token verification failed', error);

            // ✅ Nếu token không hợp lệ → thử refresh token
            const refreshResponse = await fetch(`http://localhost:3000/api/auth/refresh-token`, {
                method: 'POST',
                credentials: 'include', // gửi cookie lên server
            });

            if (refreshResponse.ok) {
                // ✅ Nếu refresh token thành công → gán lại accessToken và tiếp tục
                const response = NextResponse.next();

                // ⚠️ Nhưng chỗ này set chưa đúng (Set-Cookie là header phức tạp)
                response.cookies.set(
                    "accessToken",
                    refreshResponse.headers.get("Set-Cookie") || ""
                );

                return response;
            } else {
                // ✅ Nếu refresh cũng thất bại → xóa token và chuyển về login
                const response = NextResponse.redirect(new URL("/auth/login", request.url));
                response.cookies.delete('accessToken');
                response.cookies.delete('refreshToken');
                return response;
            }
        }
    }

    // ✅ Nếu không có token mà cố truy cập vào route không public → chuyển về login
    if (!publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // ✅ Nếu là route công khai (register/login) → cho đi tiếp
    return NextResponse.next();
}

// ✅ Cấu hình matcher để middleware chỉ áp dụng cho các route phù hợp
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // bỏ qua file tĩnh và API route
};
