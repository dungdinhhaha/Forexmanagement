import { NextRequest, NextResponse } from 'next/server';
import { methodController } from '@/controllers/server/method.controller';

// GET /api/methods - Lấy tất cả phương pháp của người dùng
export async function GET(request: NextRequest) {
  return methodController.getAllMethods(request);
}

// POST /api/methods - Tạo phương pháp mới
export async function POST(request: NextRequest) {
  return methodController.createMethod(request);
} 