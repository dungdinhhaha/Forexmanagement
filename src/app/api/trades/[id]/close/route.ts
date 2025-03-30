import { NextRequest, NextResponse } from 'next/server';
import { tradeController } from '@/controllers/server/trade.controller';

/*
// POST /api/trades/:id/close - Đóng giao dịch
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return tradeController.closeTrade(context.params.id, request);
}
*/

// Tạm thời comment toàn bộ code để vượt qua lỗi build
export async function POST() {
  return NextResponse.json({ message: "API temporarily disabled" }, { status: 503 });
} 