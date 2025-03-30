import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    
    return NextResponse.json({
      hasSession: !!session,
      hasUser: !!user,
      userId: session?.user.id || user?.id || null,
      userEmail: session?.user.email || user?.email || null, 
      sessionExpires: session ? new Date(session.expires_at! * 1000).toISOString() : null,
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