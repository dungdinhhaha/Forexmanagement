import { TradeMethod } from '@/types/method';

export interface IMethodRepository {
  getMethods(userId: string): Promise<TradeMethod[]>;
  getMethodById(id: string): Promise<TradeMethod | null>;
  createMethod(method: Omit<TradeMethod, 'id' | 'created_at' | 'updated_at'>): Promise<TradeMethod>;
  updateMethod(id: string, method: Partial<TradeMethod>): Promise<TradeMethod>;
  deleteMethod(id: string): Promise<void>;
  getMethodStats(methodId: string, userId: string): Promise<{
    totalTrades: number;
    winningTrades: number;
    winRate: number;
    totalProfit: number;
    averageProfit: number;
  }>;
} 