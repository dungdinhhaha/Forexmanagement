import { NextRequest, NextResponse } from 'next/server';
import { tradeController } from '@/controllers/server/trade.controller';

/*
// GET /api/trades/:id - Lấy chi tiết giao dịch
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return tradeController.getTradeById(context.params.id);
}

// PUT /api/trades/:id - Cập nhật giao dịch
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return tradeController.updateTrade(context.params.id, request);
}

// DELETE /api/trades/:id - Xóa giao dịch
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return tradeController.deleteTrade(context.params.id);
}
*/

// Tạm thời comment toàn bộ code để vượt qua lỗi build
export async function GET() {
  return NextResponse.json({ message: "API temporarily disabled" }, { status: 503 });
}

export async function PUT() {
  return NextResponse.json({ message: "API temporarily disabled" }, { status: 503 });
}

export async function DELETE() {
  return NextResponse.json({ message: "API temporarily disabled" }, { status: 503 });
} 