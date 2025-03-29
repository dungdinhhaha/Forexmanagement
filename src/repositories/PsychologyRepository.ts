import { supabase } from '@/lib/supabase/config';
import { IPsychologyQuestion, IPsychologyTestResult } from '@/interfaces/psychology.interface';

export class PsychologyRepository {
  async getQuestions() {
    const { data, error } = await supabase
      .from('psychology_questions')
      .select('*')
      .order('id');
      
    if (error) throw error;
    return data || [];
  }
  
  async saveTestResult(userId: string, resultData: any): Promise<IPsychologyTestResult> {
    const { data, error } = await supabase
      .from('psychology_test_results')
      .insert([{ ...resultData, user_id: userId }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
  
  async getTestResults(userId: string) {
    const { data, error } = await supabase
      .from('psychology_test_results')
      .select('*')
      .eq('user_id', userId)
      .order('taken_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  }
  
  async getTestResultById(id: string, userId: string) {
    const { data, error } = await supabase
      .from('psychology_test_results')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
      
    if (error) return null;
    return data;
  }
}

export const psychologyRepository = new PsychologyRepository(); 