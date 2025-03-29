import { Trade } from '@/types/trade';

export interface ITradeRepository {
  getAll(userId: string): Promise<Trade[]>;
  getById(id: string): Promise<Trade | null>;
  create(trade: Omit<Trade, 'id'>): Promise<Trade>;
  update(id: string, trade: Partial<Trade>): Promise<Trade>;
  delete(id: string): Promise<void>;
  getByUserId(userId: string): Promise<Trade[]>;
  getByMethodId(methodId: string): Promise<Trade[]>;
  getStats(userId: string): Promise<{
    total_trades: number;
    win_rate: number;
    total_profit: number;
    avg_profit: number;
  }>;
} 