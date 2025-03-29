import { Method, MethodRepository, MethodStats } from '@/models/method.model';
import { createClient } from '@/lib/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseMethodRepository implements MethodRepository {
  private supabase: SupabaseClient;
  
  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }
  
  async checkConnection() {
    try {
      console.log('🔌 Kiểm tra kết nối Supabase...');
      const { data, error, status } = await this.supabase.from('trade_methods').select('count(*)');
      
      console.log('🔢 Status code:', status);
      console.log('📊 Database response:', data);
      
      if (error) {
        console.error('❌ Lỗi kết nối database:', error);
        return {
          connected: false,
          error: error.message,
          details: error
        };
      }
      
      return {
        connected: true,
        tableCount: data?.[0]?.count || 0,
        status
      };
    } catch (err) {
      console.error('💥 Lỗi khi kiểm tra kết nối:', err);
      return {
        connected: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        details: err
      };
    }
  }
  
  async findAllByUserId(userId: string): Promise<Method[]> {
    console.log(`📋 Repository: Lấy phương pháp của user ${userId}`);
    
    // Log kết nối database
    const connectionStatus = await this.checkConnection();
    console.log('🔌 Trạng thái kết nối database:', connectionStatus);
    
    const { data, error } = await this.supabase
      .from('trade_methods')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Repository error:', error);
      throw new Error('Không thể lấy danh sách phương pháp');
    }
    
    console.log(`📝 Tìm thấy ${data?.length || 0} phương pháp`);
    return data || [];
  }
  
  async findById(id: string): Promise<Method | null> {
    const { data, error } = await this.supabase
      .from('trade_methods')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Repository error:', error);
      return null;
    }
    
    return data;
  }
  
  async create(method: Omit<Method, 'id' | 'created_at' | 'updated_at'>): Promise<Method> {
    const { data, error } = await this.supabase
      .from('trade_methods')
      .insert(method)
      .select()
      .single();
      
    if (error) {
      console.error('Repository error:', error);
      throw new Error('Không thể tạo phương pháp');
    }
    
    return data;
  }
  
  async update(id: string, method: Partial<Method>): Promise<Method> {
    const { data, error } = await this.supabase
      .from('trade_methods')
      .update({ ...method, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Repository error:', error);
      throw new Error('Không thể cập nhật phương pháp');
    }
    
    return data;
  }
  
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('trade_methods')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Repository error:', error);
      throw new Error('Không thể xóa phương pháp');
    }
  }
  
  async getStats(methodId: string, userId: string): Promise<MethodStats> {
    const { data, error } = await this.supabase
      .from('trades')
      .select('*')
      .eq('method_id', methodId)
      .eq('user_id', userId);

    if (error) {
      console.error('Repository error:', error);
      throw new Error('Không thể lấy thống kê');
    }

    const trades = data || [];
    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => t.profit && t.profit > 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const averageProfit = totalTrades > 0 ? totalProfit / totalTrades : 0;

    return {
      totalTrades,
      winningTrades,
      winRate,
      totalProfit,
      averageProfit
    };
  }
}

// Singleton instance creator
let repository: MethodRepository | null = null;

export const getMethodRepository = async (): Promise<MethodRepository> => {
  if (!repository) {
    const supabase = await createClient();
    repository = new SupabaseMethodRepository(supabase);
  }
  return repository;
}; 