export interface ITrade {
  id: string;
  user_id: string;
  symbol: string;
  type: 'long' | 'short';
  entry_price: number;
  exit_price: number | null;
  quantity: number;
  entry_date: string;
  exit_date: string | null;
  status: 'open' | 'closed';
  profit: number | null;
  note: string | null;
  trade_method_id: string | null;
  images: string[] | null;
  created_at: string;
  updated_at: string;
  real_backtest: 'real' | 'backtest';
}

export interface ITradeStats {
  total_trades: number;
  win_rate: number;
  total_profit: number;
  avg_profit: number;
} 