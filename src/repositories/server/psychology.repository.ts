import { PsychologyQuestion, PsychologyRepository, PsychologyTestResult, CreatePsychologyTestResultDto } from '@/models/psychology.model';
import { createAdminClient } from '@/lib/supabase/server';

export class SupabasePsychologyRepository implements PsychologyRepository {
  private questionsTable = 'psychology_questions';
  private resultsTable = 'psychology_test_results';
  
  // Lấy danh sách câu hỏi từ bảng psychology_questions
  async getQuestions(): Promise<PsychologyQuestion[]> {
    try {
      const supabase = await createAdminClient();
      
      if (!supabase) {
        console.error('❌ Supabase admin client is not initialized');
        return [];
      }
      
      const { data, error } = await supabase
        .from(this.questionsTable)
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting questions:', error);
      // Trả về mảng rỗng thay vì throw lỗi để tránh crash server
      return [];
    }
  }
  
  // Lưu kết quả kiểm tra vào bảng psychology_test_results
  async saveTestResult(resultData: CreatePsychologyTestResultDto): Promise<PsychologyTestResult> {
    try {
      const supabase = await createAdminClient();
      
      if (!supabase) {
        console.error('❌ Supabase admin client is not initialized');
        throw new Error('Database connection is not available');
      }
      
      const { data, error } = await supabase
        .from(this.resultsTable)
        .insert(resultData)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as PsychologyTestResult;
    } catch (error) {
      console.error('Error saving test result:', error);
      throw error;
    }
  }
  
  // Lấy danh sách kết quả kiểm tra của một người dùng
  async getTestResults(userId: string): Promise<PsychologyTestResult[]> {
    try {
      const supabase = await createAdminClient();
      
      if (!supabase) {
        console.error('❌ Supabase admin client is not initialized');
        return [];
      }
      
      // Kiểm tra xem userId có đúng định dạng UUID không
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
      
      if (!isValidUUID) {
        console.warn('⚠️ Invalid UUID format for userId:', userId);
        return [];
      }
      
      const { data, error } = await supabase
        .from(this.resultsTable)
        .select('*')
        .eq('user_id', userId)
        .order('taken_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting test results:', error);
      // Trả về mảng rỗng thay vì throw lỗi để tránh crash server
      return [];
    }
  }
  
  // Lấy chi tiết kết quả kiểm tra theo ID
  async getTestResultById(id: string, userId: string): Promise<PsychologyTestResult | null> {
    try {
      const supabase = await createAdminClient();
      
      if (!supabase) {
        console.error('❌ Supabase admin client is not initialized');
        return null;
      }
      
      // Kiểm tra xem id và userId có đúng định dạng UUID không
      const isValidIdUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      const isValidUserIdUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
      
      if (!isValidIdUUID || !isValidUserIdUUID) {
        console.warn('⚠️ Invalid UUID format:', { id, userId });
        return null;
      }
      
      const { data, error } = await supabase
        .from(this.resultsTable)
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Không tìm thấy kết quả
          return null;
        }
        throw error;
      }
      
      return data || null;
    } catch (error) {
      console.error('Error getting test result by ID:', error);
      return null;
    }
  }
}

// Export instance để sử dụng
export const psychologyRepository = new SupabasePsychologyRepository(); 