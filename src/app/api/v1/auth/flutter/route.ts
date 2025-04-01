import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// API documentation for Flutter authentication
export async function GET(request: NextRequest) {
  try {
    // If the request includes an auth check parameter, check authentication
    const searchParams = request.nextUrl.searchParams;
    const checkAuth = searchParams.get('check_auth');
    
    if (checkAuth === 'true') {
      const supabase = createRouteHandlerClient({ cookies });
      
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (!session) {
        return NextResponse.json({
          authenticated: false,
          user: null
        });
      }
      
      return NextResponse.json({
        authenticated: true,
        user: {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role,
        }
      });
    }
    
    // Otherwise, return API documentation
    return NextResponse.json({
      message: "Flutter Authentication API",
      endpoints: {
        auth_check: {
          url: "/api/v1/auth/flutter?check_auth=true",
          method: "GET",
          description: "Check if user is authenticated",
          response: {
            authenticated: "boolean",
            user: "User object or null"
          }
        },
        login: {
          url: "/api/v1/auth/flutter",
          method: "POST",
          description: "Login with email and password",
          request_body: {
            email: "string",
            password: "string"
          },
          response: {
            message: "string",
            user: "User object",
            session: "Session object with tokens"
          }
        },
        signup: {
          url: "/api/v1/auth/flutter/signup",
          method: "POST",
          description: "Create a new user account",
          request_body: {
            email: "string",
            password: "string",
            name: "string (optional)"
          },
          response: {
            message: "string",
            user: "User object if auto-confirmed",
            confirmationRequired: "boolean (if email confirmation is required)"
          }
        },
        logout: {
          url: "/api/v1/auth/flutter/logout",
          method: "POST",
          description: "Log out the current user",
          response: {
            message: "string"
          }
        },
        refresh: {
          url: "/api/v1/auth/flutter/refresh",
          method: "POST",
          description: "Refresh the access token",
          request_body: {
            refresh_token: "string"
          },
          response: {
            message: "string",
            session: "Session object with new tokens",
            user: "User object"
          }
        },
        test: {
          url: "/api/v1/flutter-test",
          methods: ["GET", "POST"],
          description: "Test endpoint for verifying Flutter integration",
          get_response: {
            message: "string",
            request_info: "Object with request details",
            server_info: "Server environment information"
          },
          post_request: "Any JSON object",
          post_response: {
            message: "string",
            authenticated: "boolean",
            user: "User object or null",
            received_data: "The data you sent",
            timestamp: "ISO date string"
          }
        }
      },
      related_endpoints: {
        examples: "/api/v1/flutter-example",
        psychology_module: "/api/v1/psychology"
      },
      flutter_example: `
// Example Flutter code for authentication

// Login
Future<UserModel> login(String email, String password) async {
  final response = await http.post(
    Uri.parse('\${baseUrl}/api/v1/auth/flutter'),
    headers: {'Content-Type': 'application/json'},
    body: json.encode({
      'email': email,
      'password': password,
    }),
  );
  
  if (response.statusCode == 200) {
    final data = json.decode(response.body);
    // Save tokens to secure storage
    await secureStorage.write(key: 'access_token', value: data['session']['access_token']);
    await secureStorage.write(key: 'refresh_token', value: data['session']['refresh_token']);
    return UserModel.fromJson(data['user']);
  } else {
    throw Exception('Failed to login');
  }
}

// Test connection
Future<bool> testConnection() async {
  try {
    final http.Response response = await http.get(
      Uri.parse('\${baseUrl}/api/v1/flutter-test?echo=Hello')
    );
    
    if (response.statusCode == 200) {
      print('API Connection successful: \${response.body}');
      return true;
    }
  } catch (e) {
    print('Error testing API connection: \$e');
  }
  return false;
}

// Refresh token
Future<bool> refreshToken() async {
  final refreshToken = await secureStorage.read(key: 'refresh_token');
  if (refreshToken == null) return false;

  try {
    final response = await http.post(
      Uri.parse('\${baseUrl}/api/v1/auth/flutter/refresh'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'refresh_token': refreshToken,
      }),
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      await secureStorage.write(key: 'access_token', value: data['session']['access_token']);
      await secureStorage.write(key: 'refresh_token', value: data['session']['refresh_token']);
      return true;
    }
  } catch (e) {
    print('Error refreshing token: \$e');
  }
  return false;
}
`
    });
  } catch (error) {
    console.error('Error in API documentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    );
  }
}

// Login with email and password
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      message: 'Successfully logged in',
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    );
  }
} 