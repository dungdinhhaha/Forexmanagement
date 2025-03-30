import { supabase } from '@/lib/supabase/config';
import { IPsychologyQuestion, IPsychologyTestResult } from '@/interfaces/psychology.interface';

export class PsychologyRepository {
  async getQuestions() {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return [];
    }
    
    const { data, error } = await supabase
      .from('psychology_questions')
      .select('*')
      .order('id');
      
    if (error) throw error;
    return data || [];
  }
  
  async saveTestResult(userId: string, resultData: any): Promise<IPsychologyTestResult> {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      throw new Error('Database connection is not available');
    }
    
    const { data, error } = await supabase
      .from('psychology_test_results')
      .insert([{ ...resultData, user_id: userId }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
  
  async getTestResults(userId: string) {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return [];
    }
    
    const { data, error } = await supabase
      .from('psychology_test_results')
      .select('*')
      .eq('user_id', userId)
      .order('taken_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  }
  
  async getTestResultById(id: string, userId: string) {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return null;
    }
    
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