import { NextRequest, NextResponse } from 'next/server';
import { TradeService } from '@/services/TradeService';
import { TradeRepository } from '@/repositories/TradeRepository';
import { serverAuthService } from '@/services/ServerAuthService';

const tradeRepository = new TradeRepository();
const tradeService = new TradeService();

// GET /api/trades/stats - Lấy thống kê giao dịch
export async function GET(request: NextRequest) {
  try {
    console.log('Checking authentication...');
    const userId = await serverAuthService.getCurrentUserId();
    console.log('Auth result:', { userId });

    if (!userId) {
      console.error('User not authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Getting stats for user:', userId);
    const stats = await tradeService.getTradeStats(userId);
    console.log('Stats retrieved:', stats);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting trade stats:', error);
    return NextResponse.json(
      { error: 'Failed to get trade stats', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 