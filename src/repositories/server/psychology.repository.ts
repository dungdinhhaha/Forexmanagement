import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { 
  PsychologyQuestion, 
  PsychologyTestResult, 
  CreatePsychologyTestResultDto,
  PsychologyRepository as IPsychologyRepository
} from '@/models/psychology.model';
import { createClient } from '@/lib/supabase/server';

export class PsychologyRepository implements IPsychologyRepository {
  async getQuestions(): Promise<PsychologyQuestion[]> {
    try {
      const supabase = await createClient();
      
      if (!supabase) {
        console.error('❌ Supabase client is not initialized');
        return [];
      }
      
      const { data, error } = await supabase
        .from('psychology_questions')
        .select('*')
        .order('id');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting questions:', error);
      return [];
    }
  }
  
  async saveTestResult(resultData: CreatePsychologyTestResultDto): Promise<PsychologyTestResult> {
    const supabase = await createClient();
    
    if (!supabase) {
      console.error('❌ Supabase client is not initialized');
      throw new Error('Database connection is not available');
    }
    
    const { data, error } = await supabase
      .from('psychology_test_results')
      .insert([resultData])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
  
  async getTestResults(userId: string): Promise<PsychologyTestResult[]> {
    const supabase = await createClient();
    
    if (!supabase) {
      console.error('❌ Supabase client is not initialized');
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
  
  async getTestResultById(id: string, userId: string): Promise<PsychologyTestResult | null> {
    const supabase = await createClient();
    
    if (!supabase) {
      console.error('❌ Supabase client is not initialized');
      return null;
    }
    
    const { data, error } = await supabase
      .from('psychology_test_results')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    return data;
  }
}

export const psychologyRepository = new PsychologyRepository(); 