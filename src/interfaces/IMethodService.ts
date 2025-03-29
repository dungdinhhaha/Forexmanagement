import { TradeMethod } from '@/types/method';

export interface IMethodService {
  getAllMethods(userId: string): Promise<TradeMethod[]>;
  getMethodById(id: string): Promise<TradeMethod | null>;
  createMethod(method: Omit<TradeMethod, 'id'>): Promise<TradeMethod>;
  updateMethod(id: string, method: Partial<TradeMethod>): Promise<TradeMethod>;
  deleteMethod(id: string): Promise<void>;
  getMethodStats(id: string): Promise<{
    totalTrades: number;
    winningTrades: number;
    winRate: number;
    totalProfit: number;
    averageProfit: number;
  }>;
} 