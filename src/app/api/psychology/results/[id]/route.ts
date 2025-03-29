import { NextRequest, NextResponse } from 'next/server';
import { psychologyController } from '@/controllers/server/psychology.controller';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return psychologyController.getTestResultById(params.id);
} 