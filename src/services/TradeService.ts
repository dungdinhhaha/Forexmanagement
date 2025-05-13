import { Trade } from '@/types/trade';
import { ITradeService } from '@/interfaces/ITradeService';
import { TradeRepository } from '@/repositories/TradeRepository';
import { gptService } from './gpt-service';
import { authService } from './AuthService';

export class TradeService implements ITradeService {
  private repository: TradeRepository;

  constructor() {
    this.repository = new TradeRepository();
  }

  async getAllTrades(): Promise<Trade[]> {
    const userId = await authService.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.repository.getAll(userId);
  }

  async getTradeById(id: string): Promise<Trade | null> {
    const userId = await authService.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.repository.getById(id);
  }

  async createTrade(trade: Omit<Trade, 'id'>): Promise<Trade> {
    if (!trade.user_id) throw new Error('User not authenticated');
    return this.repository.create(trade);
  }

  async updateTrade(id: string, trade: Partial<Trade>): Promise<Trade> {
    const userId = await authService.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const existingTrade = await this.repository.getById(id);
    if (!existingTrade) throw new Error('Trade not found');
    if (existingTrade.user_id !== userId) throw new Error('Unauthorized');

    return this.repository.update(id, trade);
  }

  async deleteTrade(id: string): Promise<void> {
    const userId = await authService.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const trade = await this.repository.getById(id);
    if (!trade) throw new Error('Trade not found');
    if (trade.user_id !== userId) throw new Error('Unauthorized');

    await this.repository.delete(id);
  }

  async getTradesByUserId(userId: string): Promise<Trade[]> {
    return this.repository.getByUserId(userId);
  }

  async getTradesByMethodId(methodId: string): Promise<Trade[]> {
    return this.repository.getByMethodId(methodId);
  }

  async getTradeStats(userId: string): Promise<{
    total_trades: number;
    win_rate: number;
    total_profit: number;
    avg_profit: number;
  }> {
    return this.repository.getStats(userId);
  }

  async closeTrade(id: string, exitPrice: number, userId: string): Promise<Trade> {
    if (!userId) throw new Error('User not authenticated');

    const trade = await this.repository.getById(id);
    if (!trade) throw new Error('Trade not found');
    if (trade.user_id !== userId) throw new Error('Unauthorized');
    
    const profit = trade.type === 'long'
      ? (exitPrice - trade.entry_price) * trade.quantity
      : (trade.entry_price - exitPrice) * trade.quantity;

    return this.repository.update(id, {
      exit_price: exitPrice,
      status: 'closed',
      exit_date: new Date().toISOString(),
      profit: profit
    });
  }

  async analyzeMarket(pair: string, timeframe: string): Promise<string> {
    return gptService.analyzeMarket(pair, timeframe);
  }

  async getAllTradesByUserId(userId: string): Promise<Trade[]> {
    return this.repository.getAll(userId);
  }
} 