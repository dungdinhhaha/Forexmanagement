export interface IPsychologyQuestion {
  id: string;
  question: string;
  category: 'risk_management' | 'emotional_control' | 'discipline' | 'trading_preparation' | 'trading_mindset' | 'self_improvement';
  answers: {
    text: string;
    score: number;
  }[];
  created_at: string;
}

export interface IPsychologyTestResult {
  id: string;
  user_id: string;
  score: number;
  category_scores: {
    risk_management: number;
    emotional_control: number;
    discipline: number;
    trading_preparation?: number;
    trading_mindset?: number;
    self_improvement?: number;
  };
  analysis: string;
  recommendations: string[];
  taken_at: string;
  created_at?: string;
}

export interface IPsychologyService {
  getQuestions(): Promise<IPsychologyQuestion[]>;
  submitTest(answers: { questionId: string; answerIndex: number }[]): Promise<IPsychologyTestResult>;
  getTestResults(): Promise<IPsychologyTestResult[]>;
  getTestResultById(id: string): Promise<IPsychologyTestResult | null>;
} 