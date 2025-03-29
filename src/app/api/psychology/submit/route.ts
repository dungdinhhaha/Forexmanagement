import { NextRequest, NextResponse } from 'next/server';
import { psychologyController } from '@/controllers/server/psychology.controller';

export async function POST(request: NextRequest) {
  return psychologyController.submitTest(request);
} 