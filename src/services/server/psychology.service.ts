import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { 
  PsychologyQuestion, 
  PsychologyTestResult, 
  PsychologySubmitAnswer,
  CreatePsychologyTestResultDto
} from '@/models/psychology.model';
import { psychologyRepository } from '@/repositories/server/psychology.repository';

export class PsychologyService {
  // Xác thực người dùng
  async authenticate() {
    try {
      const supabase = createServerComponentClient<Database>({ cookies });
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return { authenticated: false, error: 'Unauthorized', userId: null };
      }
      
      return { authenticated: true, error: null, userId: session.user.id };
    } catch (error) {
      console.error('Auth error:', error);
      return { authenticated: false, error: 'Authentication error', userId: null };
    }
  }
  
  // Lấy danh sách câu hỏi
  async getQuestions(): Promise<PsychologyQuestion[]> {
    try {
      return await psychologyRepository.getQuestions();
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw new Error('Failed to fetch questions');
    }
  }
  
  // Nộp bài kiểm tra và tính điểm
  async submitTest(userId: string, answers: PsychologySubmitAnswer[]): Promise<PsychologyTestResult> {
    try {
      // Lấy thông tin câu hỏi để tính điểm
      const questions = await this.getQuestions();
      
      // Tính điểm cho từng category
      const categoryScores = {
        risk_management: 0,
        emotional_control: 0,
        discipline: 0,
        trading_preparation: 0,
        trading_mindset: 0,
        self_improvement: 0
      };

      let totalScore = 0;
      const categoryCounts: Record<string, number> = {};

      answers.forEach(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        if (question) {
          // Đếm số câu hỏi theo từng category
          categoryCounts[question.category] = (categoryCounts[question.category] || 0) + 1;
          
          const score = question.answers[answer.answerIndex].score;
          if (question.category in categoryScores) {
            categoryScores[question.category as keyof typeof categoryScores] += score;
          }
          totalScore += score;
        }
      });

      // Tính điểm trung bình cho mỗi category
      Object.keys(categoryScores).forEach(category => {
        if (categoryCounts[category] > 0) {
          categoryScores[category as keyof typeof categoryScores] = Math.round(
            categoryScores[category as keyof typeof categoryScores] / categoryCounts[category]
          );
        } else {
          delete categoryScores[category as keyof typeof categoryScores];
        }
      });

      // Tổng điểm trung bình
      const averageScore = Math.round(totalScore / answers.length);

      // Tạo phân tích và khuyến nghị
      const analysis = this.generateAnalysis(categoryScores);
      const recommendations = this.generateRecommendations(categoryScores);

      // Tạo kết quả bài kiểm tra
      const testResult: CreatePsychologyTestResultDto = {
        user_id: userId,
        score: averageScore,
        category_scores: categoryScores,
        analysis,
        recommendations,
        taken_at: new Date().toISOString()
      };
      
      // Lưu kết quả vào database
      return await psychologyRepository.saveTestResult(testResult);
    } catch (error) {
      console.error('Error submitting test:', error);
      throw new Error('Failed to submit test');
    }
  }
  
  // Lấy kết quả bài kiểm tra của người dùng
  async getTestResults(userId: string): Promise<PsychologyTestResult[]> {
    try {
      return await psychologyRepository.getTestResults(userId);
    } catch (error) {
      console.error('Error fetching test results:', error);
      throw new Error('Failed to fetch test results');
    }
  }
  
  // Lấy chi tiết kết quả bài kiểm tra
  async getTestResultById(id: string, userId: string): Promise<PsychologyTestResult | null> {
    try {
      const result = await psychologyRepository.getTestResultById(id, userId);
      
      if (result) {
        // Đảm bảo dữ liệu được parse đúng định dạng
        if (typeof result.category_scores === 'string') {
          try {
            result.category_scores = JSON.parse(result.category_scores);
          } catch (e) {
            console.warn('Failed to parse category_scores:', e);
            result.category_scores = {
              risk_management: 50,
              emotional_control: 50,
              discipline: 50
            };
          }
        }
        
        if (typeof result.recommendations === 'string') {
          try {
            result.recommendations = JSON.parse(result.recommendations);
          } catch (e) {
            console.warn('Failed to parse recommendations:', e);
            result.recommendations = ["Không có khuyến nghị"];
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching test result:', error);
      throw new Error('Failed to fetch test result');
    }
  }
  
  // Tạo kết quả mẫu cho người dùng
  async createSampleResult(userId: string): Promise<PsychologyTestResult> {
    try {
      // Tạo kết quả mẫu
      const sampleResult: CreatePsychologyTestResultDto = {
        user_id: userId,
        score: 75,
        category_scores: {
          risk_management: 80,
          emotional_control: 65,
          discipline: 80
        },
        analysis: "Bạn có kỹ năng quản lý rủi ro tốt và kỷ luật cao, nhưng cần cải thiện khả năng kiểm soát cảm xúc khi giao dịch.",
        recommendations: [
          "Luyện tập thiền để cải thiện khả năng kiểm soát cảm xúc",
          "Ghi chép nhật ký giao dịch chi tiết hơn",
          "Thực hành tuân thủ kế hoạch giao dịch một cách nghiêm ngặt"
        ],
        taken_at: new Date().toISOString()
      };
      
      return await psychologyRepository.saveTestResult(sampleResult);
    } catch (error) {
      console.error('Error creating sample result:', error);
      throw new Error('Failed to create sample result');
    }
  }
  
  // Tạo các câu hỏi mẫu - chỉ dùng cho admin
  async seedQuestions(): Promise<PsychologyQuestion[]> {
    // Implement if needed
    throw new Error('Not implemented');
  }
  
  // Helper methods
  private generateAnalysis(scores: Record<string, number>): string {
    const analysis = [];
    
    if (scores.risk_management < 60) {
      analysis.push('Bạn cần cải thiện kỹ năng quản lý rủi ro. Hãy tập trung vào việc đặt stop loss và quản lý vốn tốt hơn.');
    }
    
    if (scores.emotional_control < 60) {
      analysis.push('Bạn cần rèn luyện khả năng kiểm soát cảm xúc. Tránh để cảm xúc chi phối quyết định giao dịch.');
    }
    
    if (scores.discipline < 60) {
      analysis.push('Bạn cần tăng cường tính kỷ luật trong giao dịch. Tuân thủ kế hoạch giao dịch và không để cảm xúc chi phối.');
    }
    
    if (scores.trading_preparation && scores.trading_preparation < 60) {
      analysis.push('Bạn cần cải thiện việc chuẩn bị trước khi giao dịch. Việc chuẩn bị kỹ lưỡng sẽ giúp bạn tự tin và có chiến lược rõ ràng hơn.');
    }
    
    if (scores.trading_mindset && scores.trading_mindset < 60) {
      analysis.push('Tư duy giao dịch của bạn cần được cải thiện. Hãy phát triển tư duy tích cực và phương pháp tiếp cận thị trường một cách khách quan.');
    }
    
    if (scores.self_improvement && scores.self_improvement < 60) {
      analysis.push('Bạn cần dành thời gian nhiều hơn cho việc tự phát triển. Học hỏi liên tục và rút kinh nghiệm từ mỗi giao dịch là chìa khóa để thành công.');
    }

    return analysis.join(' ');
  }

  private generateRecommendations(scores: Record<string, number>): string[] {
    const recommendations = [];

    if (scores.risk_management < 60) {
      recommendations.push('Đặt stop loss cho mọi giao dịch');
      recommendations.push('Không rủi ro quá 2% vốn cho mỗi giao dịch');
      recommendations.push('Sử dụng tỷ lệ risk/reward tối thiểu 1:2');
    }

    if (scores.emotional_control < 60) {
      recommendations.push('Thực hành thiền định để kiểm soát cảm xúc');
      recommendations.push('Viết nhật ký giao dịch để phân tích cảm xúc');
      recommendations.push('Tạo quy trình giao dịch rõ ràng và tuân thủ');
    }

    if (scores.discipline < 60) {
      recommendations.push('Lập kế hoạch giao dịch chi tiết');
      recommendations.push('Tuân thủ quy tắc giao dịch đã đặt ra');
      recommendations.push('Đánh giá hiệu suất giao dịch định kỳ');
    }

    // Thêm các khuyến nghị cho các category khác nếu cần

    return recommendations;
  }
}

export const psychologyService = new PsychologyService(); 