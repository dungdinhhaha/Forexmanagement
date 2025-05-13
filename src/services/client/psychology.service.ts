import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { IPsychologyQuestion, IPsychologyTestResult } from '@/interfaces/psychology.interface';

export class PsychologyService {
  private supabase = createClientComponentClient();

  async getQuestions(): Promise<IPsychologyQuestion[]> {
    const { data, error } = await this.supabase
      .from('psychology_questions')
      .select('*')
      .order('id');
      
    if (error) throw error;
    return data || [];
  }

  async submitTest(answers: any): Promise<IPsychologyTestResult> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Tính toán điểm và phân tích
    const categoryScores = {
      risk_management: this.calculateCategoryScore(answers, 'risk_management'),
      emotional_control: this.calculateCategoryScore(answers, 'emotional_control'),
      discipline: this.calculateCategoryScore(answers, 'discipline')
    };

    const totalScore = Object.values(categoryScores).reduce((a, b) => a + b, 0);
    const analysis = this.generateAnalysis(categoryScores);
    const recommendations = this.generateRecommendations(categoryScores);

    const { data, error } = await this.supabase
      .from('psychology_test_results')
      .insert([{ 
        user_id: user.id,
        taken_at: new Date().toISOString(),
        category_scores: categoryScores,
        score: totalScore,
        analysis: analysis,
        recommendations: recommendations
      }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  async getTestResults(): Promise<IPsychologyTestResult[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await this.supabase
      .from('psychology_test_results')
      .select('*')
      .eq('user_id', user.id)
      .order('taken_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  }

  private calculateCategoryScore(answers: any, category: string): number {
    // TODO: Implement score calculation logic
    return 0;
  }

  private generateAnalysis(scores: any): string {
    // TODO: Implement analysis generation logic
    return "Analysis pending";
  }

  private generateRecommendations(scores: any): string[] {
    // TODO: Implement recommendations generation logic
    return ["Recommendations pending"];
  }
}

export const psychologyService = new PsychologyService(); 