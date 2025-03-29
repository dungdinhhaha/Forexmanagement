import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  // Kiểm tra session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  // Kiểm tra user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  // Liệt kê tất cả cookies
  const allCookies = cookieStore.getAll().map(c => ({ 
    name: c.name, 
    value: c.name.includes('token') ? `${c.value.substring(0, 5)}...` : c.value.substring(0, 10)
  }));
  
  return NextResponse.json({
    hasSession: !!sessionData.session,
    sessionError: sessionError?.message,
    user: userData.user ? {
      id: userData.user.id,
      email: userData.user.email,
    } : null,
    userError: userError?.message,
    cookies: allCookies,
    timestamp: new Date().toISOString()
  });
} 