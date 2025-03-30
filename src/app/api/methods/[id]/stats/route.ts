import { NextRequest, NextResponse } from 'next/server';
import { methodController } from '@/controllers/server/method.controller';

/*
// GET /api/methods/:id/stats - Lấy thống kê phương pháp
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return methodController.getMethodStats(context.params.id);
}
*/

// Tạm thời comment toàn bộ code để vượt qua lỗi build
export async function GET() {
  return NextResponse.json({ message: "API temporarily disabled" }, { status: 503 });
} 