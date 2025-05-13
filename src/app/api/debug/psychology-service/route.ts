import { NextResponse } from 'next/server';
import { psychologyService } from '@/services/client/psychology.service';
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
  const results: any = {};

  // Kiểm tra getQuestions
  try {
    const questions = await psychologyService.getQuestions();
    results.getQuestions = {
      success: true,
      data: questions
    };
  } catch (error) {
    results.getQuestions = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  // Kiểm tra getTestResults 
  try {
    const testResults = await psychologyService.getTestResults();
    results.getTestResults = {
      success: true,
      data: testResults
    };
  } catch (error) {
    results.getTestResults = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  return NextResponse.json(results);
} 