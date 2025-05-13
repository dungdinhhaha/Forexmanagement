// Kiểm tra:
// 1. Cách xác thực người dùng
// 2. Cách truy vấn repository
// 3. Cách xử lý lỗi 

import { NextRequest, NextResponse } from 'next/server';
import { serverAuthService } from '@/services/ServerAuthService';
import { PsychologyRepository } from '@/repositories/PsychologyRepository';

const psychologyRepository = new PsychologyRepository();

export async function GET(request: NextRequest) {
  try {
    const userId = await serverAuthService.getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const results = await psychologyRepository.getTestResults(userId);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get psychology results' }, { status: 500 });
  }
} 