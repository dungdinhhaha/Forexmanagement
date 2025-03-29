import { Trade, TradeStats } from '@/models/trade.model';

export class TradeService {
  // Lấy tất cả giao dịch
  async getAllTrades(methodId?: string): Promise<Trade[]> {
    try {
      const url = methodId ? `/api/trades?methodId=${methodId}` : '/api/trades';
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch trades');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching trades:', error);
      throw error;
    }
  }
  
  // Lấy giao dịch theo ID
  async getTradeById(id: string): Promise<Trade> {
    try {
      const response = await fetch(`/api/trades/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch trade');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching trade:', error);
      throw error;
    }
  }
  
  // Tạo giao dịch mới
  async createTrade(data: any): Promise<Trade> {
    try {
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create trade');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating trade:', error);
      throw error;
    }
  }
  
  // Cập nhật giao dịch
  async updateTrade(id: string, data: any): Promise<Trade> {
    try {
      const response = await fetch(`/api/trades/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update trade');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating trade:', error);
      throw error;
    }
  }
  
  // Đóng giao dịch
  async closeTrade(id: string, exitPrice: number, note?: string): Promise<Trade> {
    try {
      const response = await fetch(`/api/trades/${id}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          exit_price: exitPrice,
          exit_date: new Date().toISOString(),
          note
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to close trade');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error closing trade:', error);
      throw error;
    }
  }
  
  // Xóa giao dịch
  async deleteTrade(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/trades/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete trade');
      }
    } catch (error) {
      console.error('Error deleting trade:', error);
      throw error;
    }
  }
  
  // Lấy thống kê giao dịch
  async getTradeStats(methodId?: string): Promise<TradeStats> {
    try {
      const url = methodId ? `/api/trades/stats?methodId=${methodId}` : '/api/trades/stats';
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch trade stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching trade stats:', error);
      throw error;
    }
  }
}

export const tradeService = new TradeService(); 