import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const host = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

  return NextResponse.json({
    message: "Trading Management System API",
    description: "API server for the Trading Psychology and Management System",
    versions: {
      v1: {
        url: "/api/v1",
        status: "active"
      }
    },
    documentation: {
      general: "/api/docs",
      flutter: "/api/v1/flutter-example"
    },
    host: host,
    environment: process.env.NODE_ENV || 'development'
  });
} 