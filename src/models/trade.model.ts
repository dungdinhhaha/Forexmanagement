import { BaseModel } from './base.model';

export type TradeStatus = 'open' | 'closed';
export type TradeType = 'long' | 'short';

export interface Trade extends BaseModel {
  user_id: string;
  method_id?: string;
  symbol: string;
  type: TradeType;
  status: TradeStatus;
  entry_price: number;
  exit_price?: number;
  quantity: number;
  profit?: number;
  entry_date: string;
  exit_date?: string;
  note?: string;
  screenshot_url?: string;
}

export interface TradeStats {
  total_trades: number;
  win_rate: number;
  total_profit: number;
  avg_profit: number;
}

export interface TradeRepository {
  findAllByUserId(userId: string): Promise<Trade[]>;
  findByMethodId(methodId: string): Promise<Trade[]>;
  findById(id: string): Promise<Trade | null>;
  create(trade: Omit<Trade, 'id' | 'created_at' | 'updated_at'>): Promise<Trade>;
  update(id: string, trade: Partial<Trade>): Promise<Trade>;
  delete(id: string): Promise<void>;
  closeTrade(id: string, exitPrice: number): Promise<Trade>;
  getStats(userId: string): Promise<TradeStats>;
} 