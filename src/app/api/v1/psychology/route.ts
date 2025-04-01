import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    message: "Psychology API V1",
    endpoints: {
      questions: "/api/v1/psychology/questions",
      submit: "/api/v1/psychology/submit [POST]",
      results: "/api/v1/psychology/results",
      resultById: "/api/v1/psychology/results/[id]",
      sample: "/api/v1/psychology/sample [POST]",
    },
    version: "1.0.0"
  });
} 