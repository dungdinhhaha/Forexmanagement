import { NextResponse } from 'next/server';
import { psychologyController } from '@/controllers/server/psychology.controller';

export async function GET() {
  return psychologyController.getQuestions();
} 