import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const start = Date.now();
  
  try {
    // Kiểm tra biến môi trường
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('Missing environment variables');
      return NextResponse.json({
        status: 'error',
        message: 'Missing Supabase environment variables',
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
    
    // Kết quả kiểm tra
    const result = {
      psychology_questions: { success: false, count: 0, error: null, sample: null },
      psychology_test_results: { success: false, count: 0, error: null, sample: null },
    };
    
    // Kiểm tra bảng psychology_questions
    try {
      const { data: questions, error: questionsError } = await supabase
        .from('psychology_questions')
        .select('id, question, category, created_at')
        .limit(1);
      
      if (questionsError) {
        result.psychology_questions.error = questionsError.message;
      } else {
        result.psychology_questions.success = true;
        result.psychology_questions.count = questions ? questions.length : 0;
        result.psychology_questions.sample = questions;
      }
    } catch (error) {
      result.psychology_questions.error = error instanceof Error ? error.message : String(error);
    }
    
    // Kiểm tra bảng psychology_test_results
    try {
      const { data: results, error: resultsError } = await supabase
        .from('psychology_test_results')
        .select('id, user_id, score, taken_at')
        .limit(1);
      
      if (resultsError) {
        result.psychology_test_results.error = resultsError.message;
      } else {
        result.psychology_test_results.success = true;
        result.psychology_test_results.count = results ? results.length : 0;
        result.psychology_test_results.sample = results;
      }
    } catch (error) {
      result.psychology_test_results.error = error instanceof Error ? error.message : String(error);
    }
    
    // Thử truy vấn với tên khác
    const alternativeTables = {
      psychology_questions_alt: ['questions', 'psychology_question'],
      psychology_test_results_alt: ['test_results', 'psychology_result', 'psychology_results'],
    };
    
    for (const altTable of alternativeTables.psychology_questions_alt) {
      try {
        const { data, error } = await supabase
          .from(altTable)
          .select('*')
          .limit(1);
        
        if (!error) {
          result[`alt_${altTable}`] = {
            success: true,
            count: data ? data.length : 0,
            sample: data,
          };
        }
      } catch (e) {
        // Bỏ qua lỗi với bảng thay thế
      }
    }
    
    for (const altTable of alternativeTables.psychology_test_results_alt) {
      try {
        const { data, error } = await supabase
          .from(altTable)
          .select('*')
          .limit(1);
        
        if (!error) {
          result[`alt_${altTable}`] = {
            success: true,
            count: data ? data.length : 0,
            sample: data,
          };
        }
      } catch (e) {
        // Bỏ qua lỗi với bảng thay thế
      }
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Kiểm tra bảng psychology',
      result,
      responseTime: Date.now() - start,
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