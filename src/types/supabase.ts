export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      trade_methods: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          rules: string[]
          indicators: string[]
          timeframes: string[]
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          rules: string[]
          indicators: string[]
          timeframes: string[]
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          rules?: string[]
          indicators?: string[]
          timeframes?: string[]
          created_at?: string | null
          updated_at?: string | null
        }
      }
      trades: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          type: string;
          entry_price: number;
          exit_price: number | null;
          quantity: number;
          entry_date: string;
          exit_date: string | null;
          status: string;
          profit: number | null;
          note: string | null;
          trade_method_id: string | null;
          images: string[] | null;
          created_at: string | null;
          real_backtest: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          symbol: string;
          type: string;
          entry_price: number;
          exit_price?: number | null;
          quantity: number;
          entry_date: string;
          exit_date?: string | null;
          status: string;
          profit?: number | null;
          note?: string | null;
          trade_method_id?: string | null;
          images?: string[] | null;
          created_at?: string | null;
          real_backtest?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          symbol?: string;
          type?: string;
          entry_price?: number;
          exit_price?: number | null;
          quantity?: number;
          entry_date?: string;
          exit_date?: string | null;
          status?: string;
          profit?: number | null;
          note?: string | null;
          trade_method_id?: string | null;
          images?: string[] | null;
          created_at?: string | null;
          real_backtest?: string;
        };
      }
      psychology_questions: {
        Row: {
          id: string;
          question: string;
          category: string;
          answers: any; // Ideal type would be JSON or a custom type
        };
        Insert: {
          id?: string;
          question: string;
          category: string;
          answers: any;
        };
        Update: {
          id?: string;
          question?: string;
          category?: string;
          answers?: any;
        };
      }
      psychology_test_results: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          category_scores: any;
          analysis: string;
          recommendations: string[];
          taken_at: string;
          created_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          score: number;
          category_scores: any;
          analysis: string;
          recommendations: string[];
          taken_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          score?: number;
          category_scores?: any;
          analysis?: string;
          recommendations?: string[];
          taken_at?: string;
          created_at?: string;
        };
      }
      // Các bảng khác ở đây
    }
  }
} 