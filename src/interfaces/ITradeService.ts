import { Trade } from '@/types/trade';

export interface ITradeService {
  getAllTrades(): Promise<Trade[]>;
  getTradeById(id: string): Promise<Trade | null>;
  createTrade(trade: Omit<Trade, 'id'>): Promise<Trade>;
  updateTrade(id: string, trade: Partial<Trade>): Promise<Trade>;
  deleteTrade(id: string): Promise<void>;
  getTradesByUserId(userId: string): Promise<Trade[]>;
  getTradesByMethodId(methodId: string): Promise<Trade[]>;
  getTradeStats(userId: string): Promise<{
    total_trades: number;
    win_rate: number;
    total_profit: number;
    avg_profit: number;
  }>;
  analyzeMarket(pair: string, timeframe: string): Promise<string>;
} 