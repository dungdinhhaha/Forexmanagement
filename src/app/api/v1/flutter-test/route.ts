import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Test endpoint without authentication
export async function GET(request: NextRequest) {
  try {
    // Check query parameters
    const searchParams = request.nextUrl.searchParams;
    const echo = searchParams.get('echo');

    // Get safe headers (excluding sensitive ones)
    const safeHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      if (!['cookie', 'authorization'].includes(key.toLowerCase())) {
        safeHeaders[key] = value;
      }
    });

    // Get information about the request
    const info = {
      timestamp: new Date().toISOString(),
      method: 'GET',
      params: Object.fromEntries(searchParams.entries()),
      headers: safeHeaders,
      path: request.nextUrl.pathname,
      echo: echo || 'No echo parameter provided'
    };

    return NextResponse.json({
      message: 'Flutter API test endpoint is working!',
      request_info: info,
      server_info: {
        node_env: process.env.NODE_ENV || 'development',
        api_version: 'v1'
      }
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json(
      { error: 'Test endpoint error', message: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST - Test endpoint with optional authentication
export async function POST(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication status
    const { data: { session } } = await supabase.auth.getSession();
    
    // Parse request body
    const body = await request.json().catch(() => ({}));
    
    // Prepare response
    const response = {
      message: 'Flutter API POST test received!',
      authenticated: session !== null,
      user: session ? {
        id: session.user.id,
        email: session.user.email,
      } : null,
      received_data: body,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in POST test endpoint:', error);
    return NextResponse.json(
      { error: 'Test endpoint error', message: (error as Error).message },
      { status: 500 }
    );
  }
} 