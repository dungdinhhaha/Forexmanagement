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
} 