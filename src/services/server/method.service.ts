import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Method, CreateMethodDto, UpdateMethodDto, MethodStats } from '@/models/method.model';
import { Database } from '@/types/supabase';

export class MethodService {
  // Authenticate user and get user ID
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
  
  // Get all methods for a user
  async getAllMethods(userId: string): Promise<Method[]> {
    try {
      const supabase = createServerComponentClient<Database>({ cookies });
      
      const { data, error } = await supabase
        .from('trade_methods')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform from database model to application model
      return (data || []).map(item => ({
        id: item.id,
        userId: item.user_id,
        name: item.name,
        description: item.description,
        rules: item.rules,
        indicators: item.indicators,
        timeframes: item.timeframes,
        createdAt: new Date(item.created_at || ''),
        updatedAt: item.updated_at ? new Date(item.updated_at) : null
      }));
    } catch (error) {
      console.error('Error fetching methods:', error);
      throw new Error('Failed to fetch methods');
    }
  }
  
  // Get method by ID
  async getMethodById(id: string, userId: string): Promise<Method | null> {
    try {
      const supabase = createServerComponentClient<Database>({ cookies });
      
      const { data, error } = await supabase
        .from('trade_methods')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw error;
      }
      
      if (!data) return null;
      
      // Transform to application model
      return {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        description: data.description,
        rules: data.rules,
        indicators: data.indicators,
        timeframes: data.timeframes,
        createdAt: new Date(data.created_at || ''),
        updatedAt: data.updated_at ? new Date(data.updated_at) : null
      };
    } catch (error) {
      console.error('Error fetching method:', error);
      throw new Error('Failed to fetch method');
    }
  }
  
  // Create a new method
  async createMethod(data: CreateMethodDto, userId: string): Promise<Method> {
    try {
      const supabase = createServerComponentClient<Database>({ cookies });
      
      const { data: newMethod, error } = await supabase
        .from('trade_methods')
        .insert({
          user_id: userId,
          name: data.name,
          description: data.description,
          rules: data.rules,
          indicators: data.indicators,
          timeframes: data.timeframes
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      // Transform to application model
      return {
        id: newMethod.id,
        userId: newMethod.user_id,
        name: newMethod.name,
        description: newMethod.description,
        rules: newMethod.rules,
        indicators: newMethod.indicators,
        timeframes: newMethod.timeframes,
        createdAt: new Date(newMethod.created_at || ''),
        updatedAt: newMethod.updated_at ? new Date(newMethod.updated_at) : null
      };
    } catch (error) {
      console.error('Error creating method:', error);
      throw new Error('Failed to create method');
    }
  }
  
  // Update a method
  async updateMethod(id: string, data: UpdateMethodDto, userId: string): Promise<Method> {
    try {
      const supabase = createServerComponentClient<Database>({ cookies });
      
      // Prepare update data
      const updateData: any = { updated_at: new Date().toISOString() };
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.rules !== undefined) updateData.rules = data.rules;
      if (data.indicators !== undefined) updateData.indicators = data.indicators;
      if (data.timeframes !== undefined) updateData.timeframes = data.timeframes;
      
      const { data: updatedMethod, error } = await supabase
        .from('trade_methods')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();
        
      if (error) throw error;
      
      // Transform to application model
      return {
        id: updatedMethod.id,
        userId: updatedMethod.user_id,
        name: updatedMethod.name,
        description: updatedMethod.description,
        rules: updatedMethod.rules,
        indicators: updatedMethod.indicators,
        timeframes: updatedMethod.timeframes,
        createdAt: new Date(updatedMethod.created_at || ''),
        updatedAt: updatedMethod.updated_at ? new Date(updatedMethod.updated_at) : null
      };
    } catch (error) {
      console.error('Error updating method:', error);
      throw new Error('Failed to update method');
    }
  }
  
  // Delete a method
  async deleteMethod(id: string, userId: string): Promise<void> {
    try {
      const supabase = createServerComponentClient<Database>({ cookies });
      
      const { error } = await supabase
        .from('trade_methods')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting method:', error);
      throw new Error('Failed to delete method');
    }
  }
  
  // Get method statistics
  async getMethodStats(id: string, userId: string): Promise<MethodStats> {
    try {
      // Trong thực tế, bạn sẽ truy vấn bảng trades để lấy thống kê
      // Đây là dữ liệu mẫu
      return {
        totalTrades: 0,
        winningTrades: 0,
        winRate: 0,
        totalProfit: 0,
        averageProfit: 0
      };
    } catch (error) {
      console.error('Error fetching method stats:', error);
      throw new Error('Failed to fetch method statistics');
    }
  }
}

export const methodService = new MethodService(); 