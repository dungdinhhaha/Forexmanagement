import { NextRequest, NextResponse } from 'next/server';
import { tradeController } from '@/controllers/server/trade.controller';

// POST /api/trades/:id/close - Đóng giao dịch
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return tradeController.closeTrade(params.id, request);
} 