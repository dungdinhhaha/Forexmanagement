import { NextRequest, NextResponse } from 'next/server';
import { tradeController } from '@/controllers/server/trade.controller';

// GET /api/trades/stats - Lấy thống kê giao dịch
export async function GET(request: NextRequest) {
  return tradeController.getTradeStats(request);
} 