import { NextRequest, NextResponse } from 'next/server';
import { methodController } from '@/controllers/server/method.controller';

// GET /api/methods/:id - Lấy chi tiết phương pháp
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return methodController.getMethodById(params.id);
}

// PUT /api/methods/:id - Cập nhật phương pháp
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return methodController.updateMethod(params.id, request);
}

// DELETE /api/methods/:id - Xóa phương pháp
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return methodController.deleteMethod(params.id);
} 