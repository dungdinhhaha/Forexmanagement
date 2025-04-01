import { NextResponse } from 'next/server';
import { psychologyController } from '@/controllers/server/psychology.controller';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return psychologyController.getQuestions();
} 