import { NextRequest, NextResponse } from 'next/server';
import { tradeService } from '@/services/server/trade.service';
import { Database } from '@/types/supabase';

export class TradeController {
  // Xác thực người dùng
  async authenticate() {
    return tradeService.authenticate();
  }
  
  // Lấy tất cả giao dịch
  async getAllTrades(request: NextRequest) {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      const methodId = request.nextUrl.searchParams.get('methodId');
      const trades = await tradeService.getAllTrades(auth.userId!, methodId || undefined);
      
      return NextResponse.json(trades);
    } catch (error) {
      console.error('Controller error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  // Lấy giao dịch theo ID
  async getTradeById(id: string) {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      const trade = await tradeService.getTradeById(id, auth.userId!);
      
      if (!trade) {
        return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
      }
      
      return NextResponse.json(trade);
    } catch (error) {
      console.error('Controller error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  // Tạo giao dịch mới
  async createTrade(request: NextRequest) {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      const body = await request.json();
      
      // Thêm user_id vào dữ liệu gửi lên
      const tradeData = {
        ...body,
        user_id: auth.userId // Đảm bảo user_id là của user hiện tại
      };
      
      const trade = await tradeService.createTrade(tradeData);
      
      return NextResponse.json(trade, { status: 201 });
    } catch (error) {
      console.error('Controller error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  // Cập nhật giao dịch
  async updateTrade(id: string, request: NextRequest) {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      // Kiểm tra giao dịch tồn tại
      const existingTrade = await tradeService.getTradeById(id, auth.userId!);
      if (!existingTrade) {
        return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
      }
      
      const body = await request.json();
      const updatedTrade = await tradeService.updateTrade(id, body, auth.userId!);
      
      return NextResponse.json(updatedTrade);
    } catch (error) {
      console.error('Controller error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  // Đóng giao dịch
  async closeTrade(id: string, request: NextRequest) {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      const body = await request.json();
      
      if (!body.exit_price) {
        return NextResponse.json({ error: 'Exit price is required' }, { status: 400 });
      }
      
      // Kiểm tra giao dịch tồn tại
      const existingTrade = await tradeService.getTradeById(id, auth.userId!);
      if (!existingTrade) {
        return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
      }
      
      // Kiểm tra giao dịch đã đóng chưa
      if (existingTrade.status === 'closed') {
        return NextResponse.json({ error: 'Trade is already closed' }, { status: 400 });
      }
      
      const closedTrade = await tradeService.closeTrade(id, body, auth.userId!);
      
      return NextResponse.json(closedTrade);
    } catch (error) {
      console.error('Controller error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  // Xóa giao dịch
  async deleteTrade(id: string) {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      // Kiểm tra giao dịch tồn tại
      const existingTrade = await tradeService.getTradeById(id, auth.userId!);
      if (!existingTrade) {
        return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
      }
      
      await tradeService.deleteTrade(id, auth.userId!);
      
      return NextResponse.json({ message: 'Trade deleted successfully' });
    } catch (error) {
      console.error('Controller error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  // Lấy thống kê giao dịch
  async getTradeStats(request: NextRequest) {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      const methodId = request.nextUrl.searchParams.get('methodId');
      const stats = await tradeService.getTradeStats(auth.userId!, methodId || undefined);
      
      return NextResponse.json(stats);
    } catch (error) {
      console.error('Controller error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}

export const tradeController = new TradeController(); 