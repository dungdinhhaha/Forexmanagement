import { NextResponse } from 'next/server';
import { psychologyService } from '@/services/server/psychology.service';
import { PsychologyQuestion } from '@/models/psychology.model';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Khai báo kiểu kết quả
interface ServiceResult<T = any> {
  success: boolean;
  error?: string;
  count?: number;
  sample?: T[];
  data?: any;
}

export async function GET() {
  const results: {
    authenticate: ServiceResult | null;
    getQuestions: ServiceResult<PsychologyQuestion> | null;
    // getQuestionsRepository: ServiceResult | null; // Bỏ repository direct
    getTestResults: ServiceResult | null;
  } = {
    authenticate: null,
    getQuestions: null,
    // getQuestionsRepository: null,
    getTestResults: null,
  };
  
  try {
    // Kiểm tra authenticate
    try {
      const authResult = await psychologyService.authenticate();
      results.authenticate = {
        success: true,
        data: {
          authenticated: authResult.authenticated,
          hasUserId: !!authResult.userId,
        },
      };
    } catch (error) {
      results.authenticate = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
    
    // Kiểm tra getQuestions
    try {
      const questions = await psychologyService.getQuestions();
      results.getQuestions = {
        success: true,
        count: questions?.length || 0,
        sample: questions && questions.length > 0 ? [questions[0]] : [],
      };
    } catch (error) {
      results.getQuestions = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
    
    // Bỏ phần repository trực tiếp vì không có API getRepository
    
    // Kiểm tra getTestResults 
    try {
      const auth = await psychologyService.authenticate();
      const userId = auth.authenticated ? auth.userId! : 'anonymous-user';
      
      const testResults = await psychologyService.getTestResults(userId);
      results.getTestResults = {
        success: true,
        count: testResults?.length || 0,
        sample: testResults && testResults.length > 0 ? [{ id: testResults[0].id }] : [],
      };
    } catch (error) {
      results.getTestResults = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Kiểm tra psychology service',
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error testing psychology service:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Lỗi kiểm tra psychology service',
      error: error instanceof Error ? error.message : String(error),
      results,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 