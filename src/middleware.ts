import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

// Middleware xử lý CORS và các request đến API
export async function middleware(req: NextRequest) {
  console.log('🔐 Middleware executing for path:', req.nextUrl.pathname);
  
  const res = NextResponse.next();
  
  // Kiểm tra biến môi trường
  const missingEnvVars = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Nếu là API route và thiếu biến môi trường
  if (missingEnvVars && req.nextUrl.pathname.startsWith('/api/')) {
    console.error('⚠️ Supabase environment variables are not set');
    // Thêm response header để client biết lý do lỗi
    res.headers.set('X-Error-Reason', 'Missing Supabase Configuration');
    return NextResponse.json(
      { 
        error: 'Service temporarily unavailable',
        message: 'Database connection is not configured'
      }, 
      { status: 503 }
    );
  }
  
  try {
    // Sử dụng createMiddlewareClient để đảm bảo xử lý session đúng cách
    if (!missingEnvVars) {
      const supabase = createMiddlewareClient({ req, res });

      // Refresh session if needed
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        console.log('👤 USER ID in middleware:', session.user.id);
        console.log('📧 USER EMAIL in middleware:', session.user.email);
        console.log('⏱️ SESSION EXPIRES:', session.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'No expiration');
        
        // Kiểm tra JWT
        console.log('🔑 JWT valid:', !!session.access_token);
        console.log('🔄 REFRESH TOKEN exists:', !!session.refresh_token);
        
        // Protect routes that require authentication
        const protectedRoutes = ['/dashboard', '/methods', '/trades', '/analysis', '/psychology'];
        const isProtectedRoute = protectedRoutes.some(route => 
          req.nextUrl.pathname.startsWith(route)
        );

        console.log('🛡️ Is protected route:', isProtectedRoute);

        if (isProtectedRoute && !session) {
          console.log('🚫 Unauthorized access, redirecting to login');
          return NextResponse.redirect(new URL('/login', req.url));
        }
      } else {
        console.log('⚠️ No session in middleware');
        
        // Kiểm tra cookies
        const authCookie = req.cookies.get('sb-access-token') || req.cookies.get('sb-refresh-token');
        console.log('🍪 Auth cookie exists:', !!authCookie);
        
        // Nếu không có session nhưng đang truy cập vào route được bảo vệ
        const protectedRoutes = ['/dashboard', '/methods', '/trades', '/analysis', '/psychology'];
        const isProtectedRoute = protectedRoutes.some(route => 
          req.nextUrl.pathname.startsWith(route)
        );
        
        if (isProtectedRoute) {
          console.log('🚫 Unauthorized access, redirecting to login');
          return NextResponse.redirect(new URL('/login', req.url));
        }
      }
    } else {
      // Nếu thiếu biến môi trường Supabase và đang cố truy cập các trang yêu cầu auth
      const protectedRoutes = ['/dashboard', '/methods', '/trades', '/analysis', '/psychology'];
      const isProtectedRoute = protectedRoutes.some(route => 
        req.nextUrl.pathname.startsWith(route)
      );
      
      if (isProtectedRoute) {
        console.log('🚫 Cannot access protected route without Supabase configuration');
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  } catch (error) {
    console.error('💥 Middleware error:', error);
  }

  // Cấu hình CORS headers cho API
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.headers.set('Access-Control-Max-Age', '86400'); // 24 giờ

  return res;
}

// Specify which routes middleware will run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 