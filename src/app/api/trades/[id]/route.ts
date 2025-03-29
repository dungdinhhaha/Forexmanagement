import { NextRequest, NextResponse } from 'next/server';
import { tradeController } from '@/controllers/server/trade.controller';

// GET /api/trades/:id - Lấy chi tiết giao dịch
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return tradeController.getTradeById(params.id);
}

// PUT /api/trades/:id - Cập nhật giao dịch
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return tradeController.updateTrade(params.id, request);
}

// DELETE /api/trades/:id - Xóa giao dịch
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return tradeController.deleteTrade(params.id);
} 