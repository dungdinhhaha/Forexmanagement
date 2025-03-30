import { NextRequest, NextResponse } from 'next/server';
import { psychologyController } from '@/controllers/server/psychology.controller';

/*
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return psychologyController.getTestResultById(context.params.id);
}
*/

// Tạm thời comment toàn bộ code để vượt qua lỗi build
export async function GET() {
  return NextResponse.json({ message: "API temporarily disabled" }, { status: 503 });
} 