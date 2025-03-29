import { supabase } from '@/lib/supabase/config';
import { TradeMethod } from '@/types/method';
import { IMethodRepository } from '@/interfaces/IMethodRepository';
import { authService } from '@/services/AuthService';
import { IMethod } from '@/interfaces/method.interface';

export class MethodRepository implements IMethodRepository {
  private table = 'trade_methods';

  async getAll(userId: string): Promise<IMethod[]> {
    console.log('userId', userId);
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getMethods(userId: string): Promise<TradeMethod[]> {
    console.log('Repository: getMethods called with userId', userId);
    
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    console.log('Repository: Query result', error ? `Error: ${error.message}` : `Data count: ${data?.length || 0}`);
    
    if (error) throw error;
    return data || [];
  }

  async getMethodById(id: string): Promise<TradeMethod | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  async createMethod(methodData: any): Promise<TradeMethod> {
    const { data, error } = await supabase
      .from(this.table)
      .insert([methodData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateMethod(id: string, methodData: any): Promise<TradeMethod> {
    const { data, error } = await supabase
      .from(this.table)
      .update(methodData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteMethod(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getMethodStats(methodId: string, userId: string) {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .eq('method_id', methodId)
      .eq('status', 'closed');

    if (error) throw error;

    const trades = data || [];
    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => t.profit && t.profit > 0).length;
    const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);

    const stats = {
      totalTrades,
      winningTrades,
      winRate: totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0,
      totalProfit,
      averageProfit: totalTrades > 0 ? totalProfit / totalTrades : 0,
    };
    return stats;
  }

  async create(method: Omit<IMethod, 'id'>): Promise<IMethod> {
    const { data, error } = await supabase
      .from(this.table)
      .insert([method])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const methodRepository = new MethodRepository(); 