import { NextResponse } from 'next/server';
import { serverAuthService } from '@/services/ServerAuthService';
import { PsychologyRepository } from '@/repositories/PsychologyRepository';

const psychologyRepository = new PsychologyRepository();

export async function GET() {
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