import { NextRequest, NextResponse } from 'next/server';
import { MethodService } from '@/services/MethodService';
import { MethodRepository } from '@/repositories/MethodRepository';
import { serverAuthService } from '@/services/ServerAuthService';

const methodRepository = new MethodRepository();
const methodService = new MethodService();

// GET /api/methods - Lấy tất cả methods
export async function GET(request: NextRequest) {
  try {
    console.log('Checking authentication for methods...');
    const userId = await serverAuthService.getCurrentUserId();
    console.log('Auth result:', { userId });

    if (!userId) {
      console.error('User not authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Getting methods for user:', userId);
    const methods = await methodService.getAllMethods(userId);
    console.log('Methods retrieved:', methods);

    return NextResponse.json(methods);
  } catch (error) {
    console.error('Error getting methods:', error);
    return NextResponse.json(
      { error: 'Failed to get methods', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/methods/new - Tạo phương pháp nhanh với template
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // TODO: Thay thế bằng logic lưu vào DB thực tế nếu cần
    // Hiện tại trả về dữ liệu mẫu
    return NextResponse.json({ success: true, method: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Lỗi khi tạo phương pháp' }, { status: 500 });
  }
} 