import { NextRequest, NextResponse } from 'next/server';
import { TradeService } from '@/services/TradeService';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const tradeService = new TradeService();

// GET /api/trades - Lấy tất cả giao dịch
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const trades = await tradeService.getAllTradesByUserId(user.id);
    return NextResponse.json(trades);
  } catch (error) {
    console.error('Error getting trades:', error);
    return NextResponse.json({ error: 'Failed to get trades' }, { status: 500 });
  }
}

// POST /api/trades - Tạo giao dịch mới
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    console.log('POST /api/trades data:', data);
    
    const requiredFields = ['symbol', 'type', 'entry_price', 'quantity', 'entry_date', 'status'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Thiếu trường bắt buộc: ${field}` }, { status: 400 });
      }
    }
    
    const trade = await tradeService.createTrade({ ...data, user_id: user.id });
    return NextResponse.json(trade);
  } catch (error) {
    console.error('Error creating trade:', error);
    return NextResponse.json({ error: (error as any)?.message || 'Failed to create trade' }, { status: 500 });
  }
} 