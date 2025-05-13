import { NextResponse } from 'next/server';
import { PsychologyRepository } from '@/repositories/PsychologyRepository';

const psychologyRepository = new PsychologyRepository();

export async function GET() {
  try {
    const questions = await psychologyRepository.getQuestions();
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get questions' }, { status: 500 });
  }
} 