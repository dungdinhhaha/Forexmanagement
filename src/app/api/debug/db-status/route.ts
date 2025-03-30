import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Debug: Kiểm tra kết nối database');
    
    // Kiểm tra supabase client
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Database service is currently unavailable',
        message: 'Supabase client is not configured'
      }, { status: 503 });
    }
    
    const cookieStore = cookies();
    const supabaseClient = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Kiểm tra session
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Lỗi session:', sessionError);
      return NextResponse.json({ 
        auth: { success: false, error: sessionError.message },
        db: null
      }, { status: 500 });
    }
    
    console.log('👤 Session:', { 
      exists: !!session,
      userId: session?.user?.id,
      email: session?.user?.email,
    });
    
    // Kiểm tra kết nối database
    const { data, error: countError } = await supabase
      .from('trade_methods')
      .select('*', { count: 'exact', head: true });
    
    const count = data?.length;
    
    if (countError) {
      console.error('❌ Lỗi database:', countError);
      return NextResponse.json({
        auth: { success: !!session, user: session?.user || null },
        db: { success: false, error: countError.message, details: countError }
      }, { status: 500 });
    }
    
    // Không kiểm tra thông tin bảng và schema do vấn đề TypeScript
    const tables: string[] = [];
    
    return NextResponse.json({
      auth: { 
        success: !!session, 
        user: session ? {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role
        } : null
      },
      db: { 
        success: true, 
        methodCount: count || 0,
        tables: tables,
        env: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      }
    });
  } catch (err) {
    console.error('💥 Lỗi kiểm tra:', err);
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
      details: err 
    }, { status: 500 });
  }
} 