export interface PsychologyQuestion {
  id: string;
  question: string;
  category: string;
  answers: PsychologyAnswer[];
}

export interface PsychologyAnswer {
  text: string;
  score: number;
}

export interface PsychologyTestResult {
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
    [key: string]: number | undefined;
  };
  analysis: string;
  recommendations: string[];
  taken_at: string;
  created_at?: string;
}

export interface PsychologySubmitAnswer {
  questionId: string;
  answerIndex: number;
}

export interface CreatePsychologyTestResultDto {
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
}

export interface PsychologyRepository {
  getQuestions(): Promise<PsychologyQuestion[]>;
  saveTestResult(resultData: CreatePsychologyTestResultDto): Promise<PsychologyTestResult>;
  getTestResults(userId: string): Promise<PsychologyTestResult[]>;
  getTestResultById(id: string, userId: string): Promise<PsychologyTestResult | null>;
} 