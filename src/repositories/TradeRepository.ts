import { supabase } from '@/lib/supabase/config';
import { Trade } from '@/types/trade';
import { ITradeRepository } from '@/interfaces/ITradeRepository';

export class TradeRepository implements ITradeRepository {
  private table = 'trades';

  async getAll(userId: string): Promise<Trade[]> {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return [];
    }
    
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<Trade | null> {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return null;
    }
    
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(trade: Omit<Trade, 'id'>): Promise<Trade> {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      throw new Error('Database connection is not available');
    }
    
    const { data, error } = await supabase
      .from(this.table)
      .insert([trade])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, trade: Partial<Trade>): Promise<Trade> {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      throw new Error('Database connection is not available');
    }
    
    const { data, error } = await supabase
      .from(this.table)
      .update(trade)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      throw new Error('Database connection is not available');
    }
    
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getByUserId(userId: string): Promise<Trade[]> {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return [];
    }
    
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  async getByMethodId(methodId: string): Promise<Trade[]> {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return [];
    }
    
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('method_id', methodId);

    if (error) throw error;
    return data || [];
  }

  async getStats(userId: string): Promise<{
    total_trades: number;
    win_rate: number;
    total_profit: number;
    avg_profit: number;
  }> {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return {
        total_trades: 0,
        win_rate: 0,
        total_profit: 0,
        avg_profit: 0
      };
    }
    
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const trades = data || [];
    const total_trades = trades.length;
    const winning_trades = trades.filter(t => t.profit && t.profit > 0).length;
    const win_rate = total_trades > 0 ? (winning_trades / total_trades) * 100 : 0;
    const total_profit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const avg_profit = total_trades > 0 ? total_profit / total_trades : 0;

    return {
      total_trades,
      win_rate,
      total_profit,
      avg_profit
    };
  }
} 