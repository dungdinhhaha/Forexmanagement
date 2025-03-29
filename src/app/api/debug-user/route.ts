import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    console.log('🔍 Debug User API: Checking user authentication...');
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Lấy thông tin session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log('Session error:', sessionError || 'None');
    console.log('Session exists:', !!session);
    
    if (session) {
      console.log('🔐 USER ID:', session.user.id);
      console.log('📧 USER EMAIL:', session.user.email);
      console.log('⏱️ SESSION EXPIRES:', new Date(session.expires_at! * 1000).toISOString());
    }
    
    // Lấy thông tin user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    console.log('User error:', userError || 'None');
    console.log('User exists:', !!user);
    
    if (user) {
      console.log('👤 User details:', {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at
      });
    }
    
    // Kiểm tra các cookies
    const allCookies = cookieStore.getAll();
    const authCookies = allCookies.filter(c => 
      c.name.includes('supabase') || 
      c.name.includes('sb-') || 
      c.name.includes('auth')
    );
    
    return NextResponse.json({
      hasSession: !!session,
      hasUser: !!user,
      userId: session?.user.id || user?.id || null,
      userEmail: session?.user.email || user?.email || null, 
      sessionExpires: session ? new Date(session.expires_at! * 1000).toISOString() : null,
      authCookies: authCookies.map(c => ({
        name: c.name,
        // Che giấu giá trị token cho bảo mật
        value: c.name.includes('token') ? 
          `${c.value.substring(0, 5)}...${c.value.substring(c.value.length - 5)}` : 
          c.value.substring(0, 15) + '...',
        expires: c.expires
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('💥 Debug API error:', error);
    return NextResponse.json({ 
      error: 'Debug API error', 
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 