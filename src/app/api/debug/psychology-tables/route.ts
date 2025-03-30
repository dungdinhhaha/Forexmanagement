import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Kiểm tra biến môi trường
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing Supabase environment variables',
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
    
    // Tạo client Supabase với service key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
    
    // Kiểm tra psychology_questions
    const { data: questionsData, error: questionsError } = await supabase
      .from('psychology_questions')
      .select('id, question, category, created_at')
      .limit(5);
    
    // Kiểm tra psychology_test_results
    const { data: resultsData, error: resultsError } = await supabase
      .from('psychology_test_results')
      .select('id, user_id, score, taken_at, created_at')
      .limit(5);
    
    // Lấy số lượng bản ghi trong các bảng
    const { count: questionsCount, error: qCountError } = await supabase
      .from('psychology_questions')
      .select('*', { count: 'exact', head: true });
    
    const { count: resultsCount, error: rCountError } = await supabase
      .from('psychology_test_results')
      .select('*', { count: 'exact', head: true });
    
    return NextResponse.json({
      status: 'success',
      data: {
        psychology_questions: {
          exists: !questionsError,
          error: questionsError ? questionsError.message : null,
          count: questionsCount || 0,
          sample: questionsData || [],
        },
        psychology_test_results: {
          exists: !resultsError,
          error: resultsError ? resultsError.message : null,
          count: resultsCount || 0,
          sample: resultsData || [],
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error checking psychology tables:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Error checking psychology tables',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 