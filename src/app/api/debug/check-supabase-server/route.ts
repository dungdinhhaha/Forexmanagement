import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Hàm xử lý request GET
export async function GET() {
  const start = Date.now();
  
  try {
    // Kiểm tra biến môi trường
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('Missing environment variables:', {
        hasSupabaseUrl: !!supabaseUrl,
        hasSupabaseServiceKey: !!supabaseServiceKey,
      });
      
      return NextResponse.json({
        status: 'error',
        message: 'Missing Supabase environment variables',
        environment: process.env.NODE_ENV,
        variables: {
          NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
          SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey,
        },
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
    
    // Tạo client Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
    
    // Thực hiện truy vấn đơn giản để kiểm tra kết nối
    const { data, error } = await supabase
      .from('trade_methods')
      .select('id')
      .limit(1);
      
    const responseTime = Date.now() - start;
    
    if (error) {
      console.error('Supabase query error:', error);
      
      return NextResponse.json({
        status: 'error',
        message: 'Supabase query error',
        error: error.message,
        details: error,
        responseTime,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful',
      data: {
        recordsReturned: data?.length || 0,
        responseTime,
      },
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Server error when testing Supabase connection:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Server error when testing Supabase connection',
      error: error instanceof Error ? error.message : String(error),
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 