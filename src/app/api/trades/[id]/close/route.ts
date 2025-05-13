import { NextRequest, NextResponse } from 'next/server';
import { TradeService } from '@/services/TradeService';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const tradeService = new TradeService();

// POST /api/trades/:id/close - Đóng giao dịch
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { exit_price } = await request.json();
    if (typeof exit_price !== 'number') {
      return NextResponse.json({ error: 'Thiếu hoặc sai kiểu exit_price' }, { status: 400 });
    }

    const trade = await tradeService.closeTrade(params.id, exit_price, user.id);
    return NextResponse.json(trade);
  } catch (error) {
    console.error('Error closing trade:', error);
    return NextResponse.json({ error: (error as any)?.message || 'Failed to close trade' }, { status: 500 });
  }
} 