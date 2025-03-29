export interface TradeMethod {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  rules: string[];
  indicators: string[];
  timeframes: string[];
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: string;
  user_id: string;
  trade_method_id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entry_price: number;
  exit_price?: number;
  quantity: number;
  entry_date: string;
  exit_date?: string;
  status: 'OPEN' | 'CLOSED';
  profit?: number;
  note?: string;
  images?: string[];
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  balance: number;
  currency: string;
  broker?: string;
  account_number?: string;
  created_at: string;
  updated_at: string;
}

export interface PsychologyQuestion {
  id: string;
  question: string;
  category: string;
  answers: Array<{
    text: string;
    score: number;
  }>;
  created_at: string;
}

export interface PsychologyTestResult {
  id: string;
  user_id: string;
  taken_at: string;
  category_scores: {
    [key: string]: number;
  };
  score: number;
  analysis?: string;
  recommendations?: string[];
  created_at: string;
} 