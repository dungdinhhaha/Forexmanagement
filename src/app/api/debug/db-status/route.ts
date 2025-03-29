import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Debug: Kiểm tra kết nối database');
    
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Kiểm tra session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
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
    const { data, error, status } = await supabase
      .from('trade_methods')
      .select('count(*)')
      .single();
    
    if (error) {
      console.error('❌ Lỗi database:', error);
      return NextResponse.json({
        auth: { success: !!session, user: session?.user || null },
        db: { success: false, error: error.message, status, details: error }
      }, { status: 500 });
    }
    
    // Kiểm tra bảng và schema
    const { data: tableInfo, error: schemaError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    const tables = tableInfo?.map(t => t.table_name) || [];
    
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
        methodCount: data?.count || 0,
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