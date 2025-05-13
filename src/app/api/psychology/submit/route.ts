import { NextRequest, NextResponse } from 'next/server';
import { serverAuthService } from '@/services/ServerAuthService';
import { PsychologyRepository } from '@/repositories/PsychologyRepository';

const psychologyRepository = new PsychologyRepository();

export async function POST(request: NextRequest) {
  try {
    const userId = await serverAuthService.getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    const result = await psychologyRepository.saveTestResult(userId, data);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit test' }, { status: 500 });
  }
} 