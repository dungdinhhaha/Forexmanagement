export interface IPsychologyQuestion {
  id: number;
  question: string;
  category: string;
  options: {
    text: string;
    score: number;
  }[];
}

export interface IPsychologyTestResult {
  id: string;
  user_id: string;
  taken_at: string;
  category_scores: {
    [key: string]: number;
  };
  score: number;
  analysis: string;
  recommendations: string[];
  created_at: string;
}

export interface IPsychologyService {
  getQuestions(): Promise<IPsychologyQuestion[]>;
  submitTest(answers: { questionId: string; answerIndex: number }[]): Promise<IPsychologyTestResult>;
  getTestResults(): Promise<IPsychologyTestResult[]>;
  getTestResultById(id: string): Promise<IPsychologyTestResult | null>;
} 