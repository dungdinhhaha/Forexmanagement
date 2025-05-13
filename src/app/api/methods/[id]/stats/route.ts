import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/methods/:id/stats - Lấy thống kê phương pháp
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const methodId = context.params.id;
    const { data, error } = await supabase
      .from('trade_methods')
      .select('total_trades, win_trades, lose_trades, draw_trades')
      .eq('id', methodId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Not found' }, { status: 404 });
    }

    const { total_trades, win_trades, lose_trades, draw_trades } = data;
    const winRate = total_trades > 0 ? (win_trades / total_trades) * 100 : 0;

    return NextResponse.json({
      total_trades,
      win_trades,
      lose_trades,
      draw_trades,
      win_rate: winRate,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 