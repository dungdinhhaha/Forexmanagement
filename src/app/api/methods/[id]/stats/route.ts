import { NextRequest, NextResponse } from 'next/server';
import { methodController } from '@/controllers/server/method.controller';

// GET /api/methods/:id/stats - Lấy thống kê phương pháp
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return methodController.getMethodStats(params.id);
} 