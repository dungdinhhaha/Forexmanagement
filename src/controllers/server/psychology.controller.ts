import { NextRequest, NextResponse } from 'next/server';
import { psychologyService } from '@/services/server/psychology.service';

export class PsychologyController {
  // Xác thực người dùng
  async authenticate() {
    return psychologyService.authenticate();
  }
  
  // Lấy danh sách câu hỏi
  async getQuestions() {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      const questions = await psychologyService.getQuestions();
      return NextResponse.json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
  }
  
  // Nộp bài kiểm tra
  async submitTest(request: NextRequest) {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      const body = await request.json();
      const { answers } = body;
      
      if (!answers || !Array.isArray(answers)) {
        return NextResponse.json(
          { error: 'Invalid data. Answers array is required.' },
          { status: 400 }
        );
      }
      
      const result = await psychologyService.submitTest(auth.userId!, answers);
      return NextResponse.json(result);
    } catch (error) {
      console.error('Error submitting test:', error);
      return NextResponse.json({ error: 'Failed to submit test' }, { status: 500 });
    }
  }
  
  // Lấy kết quả bài kiểm tra
  async getTestResults() {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      const results = await psychologyService.getTestResults(auth.userId!);
      return NextResponse.json(results);
    } catch (error) {
      console.error('Error fetching test results:', error);
      return NextResponse.json({ error: 'Failed to fetch test results' }, { status: 500 });
    }
  }
  
  // Lấy chi tiết kết quả bài kiểm tra
  async getTestResultById(id: string) {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      const result = await psychologyService.getTestResultById(id, auth.userId!);
      
      if (!result) {
        return NextResponse.json({ error: 'Test result not found' }, { status: 404 });
      }
      
      return NextResponse.json(result);
    } catch (error) {
      console.error('Error fetching test result:', error);
      return NextResponse.json({ error: 'Failed to fetch test result' }, { status: 500 });
    }
  }
  
  // Tạo kết quả mẫu
  async createSampleResult() {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      const result = await psychologyService.createSampleResult(auth.userId!);
      return NextResponse.json(result);
    } catch (error) {
      console.error('Error creating sample result:', error);
      return NextResponse.json({ error: 'Failed to create sample result' }, { status: 500 });
    }
  }
}

export const psychologyController = new PsychologyController(); 