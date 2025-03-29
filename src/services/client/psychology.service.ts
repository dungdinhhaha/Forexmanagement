import { 
  PsychologyQuestion, 
  PsychologyTestResult, 
  PsychologySubmitAnswer 
} from '@/models/psychology.model';

export class PsychologyService {
  // Lấy danh sách câu hỏi
  async getQuestions(): Promise<PsychologyQuestion[]> {
    try {
      const response = await fetch('/api/psychology/questions');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch questions');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }
  
  // Nộp bài kiểm tra
  async submitTest(answers: PsychologySubmitAnswer[]): Promise<PsychologyTestResult> {
    try {
      const response = await fetch('/api/psychology/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit test');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting test:', error);
      throw error;
    }
  }
  
  // Lấy kết quả bài kiểm tra
  async getTestResults(): Promise<PsychologyTestResult[]> {
    try {
      const response = await fetch('/api/psychology/results');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch test results');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching test results:', error);
      throw error;
    }
  }
  
  // Lấy chi tiết kết quả bài kiểm tra
  async getTestResultById(id: string): Promise<PsychologyTestResult> {
    try {
      const response = await fetch(`/api/psychology/results/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch test result');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching test result:', error);
      throw error;
    }
  }
  
  // Tạo kết quả mẫu
  async createSampleResult(): Promise<PsychologyTestResult> {
    try {
      const response = await fetch('/api/psychology/sample', {
        method: 'POST'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create sample result');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating sample result:', error);
      throw error;
    }
  }
}

export const psychologyService = new PsychologyService(); 