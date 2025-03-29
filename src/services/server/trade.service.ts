import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { Trade, TradeStats } from '@/models/trade.model';

export class TradeService {
  // Xác thực người dùng
  async authenticate() {
    try {
      const supabase = createServerComponentClient<Database>({ cookies });
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return { authenticated: false, error: 'Unauthorized', userId: null };
      }
      
      return { authenticated: true, error: null, userId: session.user.id };
    } catch (error) {
      console.error('Auth error:', error);
      return { authenticated: false, error: 'Authentication error', userId: null };
    }
  }
  
  // Lấy tất cả giao dịch của người dùng
  async getAllTrades(userId: string, methodId?: string): Promise<Trade[]> {
    try {
      const supabase = createServerComponentClient<Database>({ cookies });
      
      let query = supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('entry_date', { ascending: false });
        
      // Nếu có methodId, thêm điều kiện lọc
      if (methodId) {
        query = query.eq('trade_method_id', methodId);
      }
        
      const { data, error } = await query;
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching trades:', error);
      throw new Error('Failed to fetch trades');
    }
  }
  
  // Lấy giao dịch theo ID
  async getTradeById(id: string, userId: string): Promise<Trade | null> {
    try {
      const supabase = createServerComponentClient<Database>({ cookies });
      
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching trade:', error);
      throw new Error('Failed to fetch trade');
    }
  }
  
  // Tạo giao dịch mới
  async createTrade(tradeData: any): Promise<Trade> {
    try {
      const supabase = createServerComponentClient<Database>({ cookies });
      
      const { data, error } = await supabase
        .from('trades')
        .insert([tradeData])
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating trade:', error);
      throw new Error('Failed to create trade');
    }
  }
  
  // Cập nhật giao dịch
  async updateTrade(id: string, tradeData: any, userId: string): Promise<Trade> {
    try {
      const supabase = createServerComponentClient<Database>({ cookies });
      
      const { data, error } = await supabase
        .from('trades')
        .update(tradeData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating trade:', error);
      throw new Error('Failed to update trade');
    }
  }
  
  // Đóng giao dịch
  async closeTrade(id: string, closeData: any, userId: string): Promise<Trade> {
    try {
      const supabase = createServerComponentClient<Database>({ cookies });
      
      // Lấy thông tin giao dịch hiện tại
      const { data: trade, error: fetchError } = await supabase
        .from('trades')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      
      if (fetchError) throw new Error('Trade not found');
      
      if (trade.status === 'closed') {
        throw new Error('Trade is already closed');
      }
      
      // Tính toán lợi nhuận
      const entryTotal = trade.entry_price * trade.quantity;
      const exitTotal = closeData.exit_price * trade.quantity;
      const profit = trade.type === 'long' 
        ? exitTotal - entryTotal
        : entryTotal - exitTotal;
      
      // Cập nhật trạng thái giao dịch
      const updateData = {
        status: 'closed',
        exit_price: closeData.exit_price,
        exit_date: closeData.exit_date || new Date().toISOString(),
        profit,
        note: closeData.note !== undefined ? closeData.note : trade.note
      };
      
      const { data, error } = await supabase
        .from('trades')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error closing trade:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to close trade');
    }
  }
  
  // Xóa giao dịch
  async deleteTrade(id: string, userId: string): Promise<void> {
    try {
      const supabase = createServerComponentClient<Database>({ cookies });
      
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting trade:', error);
      throw new Error('Failed to delete trade');
    }
  }
  
  // Lấy thống kê giao dịch
  async getTradeStats(userId: string, methodId?: string): Promise<TradeStats> {
    try {
      const supabase = createServerComponentClient<Database>({ cookies });
      
      let query = supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId);
        
      // Nếu có methodId, thêm điều kiện lọc
      if (methodId) {
        query = query.eq('trade_method_id', methodId);
      }
        
      const { data, error } = await query;
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return {
          total_trades: 0,
          win_rate: 0,
          total_profit: 0,
          avg_profit: 0
        };
      }
      
      // Tính toán thống kê
      const totalTrades = data.length;
      const closedTrades = data.filter(trade => trade.status === 'closed');
      const winningTrades = closedTrades.filter(trade => trade.profit > 0);
      const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
      
      const totalProfit = closedTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
      const avgProfit = closedTrades.length > 0 ? totalProfit / closedTrades.length : 0;
      
      return {
        total_trades: totalTrades,
        win_rate: winRate,
        total_profit: totalProfit,
        avg_profit: avgProfit
      };
    } catch (error) {
      console.error('Error fetching trade stats:', error);
      throw new Error('Failed to fetch trade statistics');
    }
  }
}

export const tradeService = new TradeService(); 