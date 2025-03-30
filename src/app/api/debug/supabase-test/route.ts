import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Kiểm tra xem có biến môi trường không
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Supabase environment variables are not set',
        environmentCheck: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey
        }
      }, { status: 500 });
    }
    
    // Thử tạo Supabase client
    console.log('🔌 Trying to create Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Kiểm tra kết nối đến Supabase
    console.log('🧪 Testing Supabase connection...');
    const startTime = Date.now();
    const { data, error, count, status } = await supabase
      .from('trade_methods')
      .select('*', { count: 'exact', head: true })
      .limit(1);
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    
    if (error) {
      console.error('❌ Supabase connection error:', error);
      return NextResponse.json({
        status: 'error',
        message: 'Failed to connect to Supabase',
        error: {
          message: error.message,
          code: error.code,
          details: error.details
        },
        statusCode: status,
        responseTime
      }, { status: 500 });
    }
    
    // Kết nối thành công
    console.log('✅ Supabase connection successful!');
    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection test successful',
      statusCode: status,
      count,
      responseTime,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('💥 Error testing Supabase connection:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error testing Supabase connection',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 