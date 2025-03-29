import { NextRequest, NextResponse } from 'next/server';
import { tradeController } from '@/controllers/server/trade.controller';

// GET /api/trades - Lấy tất cả giao dịch
export async function GET(request: NextRequest) {
  return tradeController.getAllTrades(request);
}

// POST /api/trades - Tạo giao dịch mới
export async function POST(request: NextRequest) {
  return tradeController.createTrade(request);
} 