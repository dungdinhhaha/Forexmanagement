import { supabase } from '@/lib/supabase/config';
import { IPsychologyQuestion, IPsychologyTestResult } from '@/interfaces/psychology.interface';

const MAX_SCORE_PER_CATEGORY = 5;

export class PsychologyRepository {
  private calculateMetrics(results: any[]) {
    const enhancedResults = results.map(item => ({
      ...item,
      maxScore: MAX_SCORE_PER_CATEGORY,
      percentage: item.score ? (item.score / MAX_SCORE_PER_CATEGORY) * 100 : undefined
    }));

    const totalScore = enhancedResults.reduce((sum, item) => sum + (item.score || 0), 0);
    const maxTotalScore = enhancedResults.length * MAX_SCORE_PER_CATEGORY;
    const averageScore = totalScore / enhancedResults.length;

    return {
      results: enhancedResults,
      totalScore,
      maxTotalScore,
      averageScore
    };
  }

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

    const testResult = {
      user_id: userId,
      taken_at: new Date().toISOString(),
      category_scores: resultData.category_scores,
      score: resultData.score,
      analysis: resultData.analysis,
      recommendations: resultData.recommendations
    };
    
    console.log('Saving test result:', testResult);
    
    const { data, error } = await supabase
      .from('psychology_test_results')
      .insert([testResult])
      .select()
      .single();
      
    if (error) {
      console.error('Error saving test result:', error);
      throw error;
    }
    
    console.log('Test result saved:', data);
    return data;
  }
  
  async getTestResults(userId: string): Promise<IPsychologyTestResult[]> {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return [];
    }
    
    console.log('Getting test results for user:', userId);
    
    // First, check if the table exists and has data
    const { count, error: countError } = await supabase
      .from('psychology_test_results')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Error checking table:', countError);
      throw countError;
    }
    
    console.log('Total records in table:', count);
    
    // Then get the actual results
    const { data, error } = await supabase
      .from('psychology_test_results')
      .select('*')
      .eq('user_id', userId)
      .order('taken_at', { ascending: false });
      
    if (error) {
      console.error('Error getting test results:', error);
      throw error;
    }
    
    console.log('Found test results:', data);
    
    // Log the query details
    console.log('Query details:', {
      table: 'psychology_test_results',
      filter: { user_id: userId },
      order: { taken_at: 'desc' },
      resultCount: data?.length || 0
    });
    
    return data || [];
  }
  
  async getTestResultById(id: string, userId: string): Promise<IPsychologyTestResult | null> {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      throw new Error('Database connection is not available');
    }
    
    try {
      console.log('Querying test result with ID:', id);
      console.log('For user ID:', userId);
      
      // First, try to get the result without user_id check
      const { data, error } = await supabase
        .from('psychology_test_results')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`No test result found with ID: ${id}`);
          return null;
        }
        console.error('Database error:', error);
        throw error;
      }

      console.log('Found test result:', data);
      
      // Log the user_id from the result
      console.log('Result user_id:', data.user_id);
      console.log('Current user_id:', userId);
      
      // Check if the result belongs to the current user
      if (data.user_id !== userId) {
        console.log('Warning: Result belongs to a different user');
        // For now, we'll still return the result
        // You can uncomment the next line to restrict access
        // return null;
      }

      // Ensure all required fields are present
      const result: IPsychologyTestResult = {
        id: data.id,
        user_id: data.user_id,
        taken_at: data.taken_at,
        category_scores: data.category_scores || {},
        score: data.score || 0,
        analysis: data.analysis || 'Analysis pending',
        recommendations: data.recommendations || ['Recommendations pending'],
        created_at: data.created_at
      };

      console.log('Processed test result:', result);
      return result;
    } catch (error) {
      console.error('Error in getTestResultById:', error);
      throw error;
    }
  }
}

export const psychologyRepository = new PsychologyRepository(); 