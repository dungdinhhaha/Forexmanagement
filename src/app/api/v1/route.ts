import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    message: "Trading Management System API V1",
    modules: {
      psychology: {
        base: "/api/v1/psychology",
        description: "Psychology test system for trading psychology evaluation",
        endpoints: {
          questions: "/api/v1/psychology/questions",
          submit: "/api/v1/psychology/submit [POST]",
          results: "/api/v1/psychology/results",
          resultById: "/api/v1/psychology/results/:id",
          sample: "/api/v1/psychology/sample [POST]",
        }
      },
      auth: {
        base: "/api/v1/auth",
        description: "Authentication system for the trading platform",
        endpoints: {
          flutter: {
            base: "/api/v1/auth/flutter",
            description: "Authentication endpoints specifically for Flutter apps",
            endpoints: {
              check: "/api/v1/auth/flutter?check_auth=true [GET]",
              login: "/api/v1/auth/flutter [POST]",
              signup: "/api/v1/auth/flutter/signup [POST]",
              logout: "/api/v1/auth/flutter/logout [POST]",
              refresh: "/api/v1/auth/flutter/refresh [POST]"
            }
          }
        }
      },
      // Add other modules here as they become available
    },
    documentation: {
      api_docs: "/api/docs",
      psychology_module: "/api/v1/psychology",
      flutter_auth: "/api/v1/auth/flutter"
    },
    version: "1.0.0"
  });
} 