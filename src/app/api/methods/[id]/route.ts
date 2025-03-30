import { NextRequest, NextResponse } from 'next/server';
import { methodController } from '@/controllers/server/method.controller';

/*
// GET /api/methods/:id/stats
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    return methodController.getMethodStats(params.id);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT /api/methods/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    return methodController.updateMethod(params.id, request);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/methods/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    return methodController.deleteMethod(params.id);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
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