import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    message: "Trading Management System API Documentation",
    version: "1.0.0",
    base_url: "/api",
    api_versions: {
      v1: {
        url: "/api/v1",
        modules: {
          psychology: {
            description: "Psychology test module API endpoints",
            base_url: "/api/v1/psychology",
            endpoints: [
              {
                path: "/questions",
                method: "GET",
                description: "Get all psychology test questions",
                authentication: "Optional",
                response_format: {
                  type: "Array",
                  items: {
                    id: "string (UUID)",
                    question: "string",
                    category: "string",
                    answers: [
                      {
                        text: "string",
                        score: "number"
                      }
                    ],
                    created_at: "string (ISO date)"
                  }
                }
              },
              {
                path: "/results",
                method: "GET",
                description: "Get all psychology test results for the authenticated user",
                authentication: "Optional - returns anonymous results if no auth",
                response_format: {
                  type: "Array",
                  items: {
                    id: "string (UUID)",
                    user_id: "string (UUID)",
                    score: "number",
                    category_scores: {
                      risk_management: "number",
                      emotional_control: "number",
                      discipline: "number",
                      trading_preparation: "number (optional)",
                      trading_mindset: "number (optional)",
                      self_improvement: "number (optional)"
                    },
                    analysis: "string",
                    recommendations: "Array<string>",
                    taken_at: "string (ISO date)",
                    created_at: "string (ISO date)"
                  }
                }
              },
              {
                path: "/results/:id",
                method: "GET",
                description: "Get a specific psychology test result by ID",
                parameters: {
                  id: "UUID of the test result"
                },
                authentication: "Optional - works for anonymous users with valid ID",
                response_format: {
                  id: "string (UUID)",
                  user_id: "string (UUID)",
                  score: "number",
                  category_scores: {
                    risk_management: "number",
                    emotional_control: "number",
                    discipline: "number",
                    trading_preparation: "number (optional)",
                    trading_mindset: "number (optional)",
                    self_improvement: "number (optional)"
                  },
                  analysis: "string",
                  recommendations: "Array<string>",
                  taken_at: "string (ISO date)",
                  created_at: "string (ISO date)"
                }
              },
              {
                path: "/submit",
                method: "POST",
                description: "Submit answers to the psychology test",
                authentication: "Optional - creates anonymous result if no auth",
                request_format: {
                  answers: [
                    {
                      questionId: "string (UUID)",
                      answerIndex: "number"
                    }
                  ]
                },
                response_format: {
                  id: "string (UUID)",
                  user_id: "string (UUID)",
                  score: "number",
                  category_scores: {
                    risk_management: "number",
                    emotional_control: "number",
                    discipline: "number",
                    trading_preparation: "number (optional)",
                    trading_mindset: "number (optional)",
                    self_improvement: "number (optional)"
                  },
                  analysis: "string",
                  recommendations: "Array<string>",
                  taken_at: "string (ISO date)",
                  created_at: "string (ISO date)"
                }
              },
              {
                path: "/sample",
                method: "POST",
                description: "Create a sample test result for demonstration purposes",
                authentication: "Optional - creates anonymous sample if no auth",
                response_format: {
                  id: "string (UUID)",
                  user_id: "string (UUID)",
                  score: "number",
                  category_scores: {
                    risk_management: "number",
                    emotional_control: "number",
                    discipline: "number"
                  },
                  analysis: "string",
                  recommendations: "Array<string>",
                  taken_at: "string (ISO date)",
                  created_at: "string (ISO date)"
                }
              }
            ]
          }
          // Add other API modules here as they become available
        }
      }
    },
    authentication: {
      description: "API uses Supabase authentication. Flutter apps should include the authorization header",
      header: "Authorization: Bearer [JWT token]",
      supabase_auth_endpoints: {
        sign_up: "POST /auth/v1/signup",
        sign_in: "POST /auth/v1/token?grant_type=password",
        refresh_token: "POST /auth/v1/token?grant_type=refresh_token"
      }
    },
    error_format: {
      error: "Error message",
      status: "HTTP status code"
    },
    flutter_example: {
      description: "Example Flutter code for calling the API",
      get_questions: `
Future<List<Question>> getQuestions() async {
  final response = await http.get(Uri.parse('$baseUrl/api/v1/psychology/questions'));
  if (response.statusCode == 200) {
    final List<dynamic> jsonData = json.decode(response.body);
    return jsonData.map((data) => Question.fromJson(data)).toList();
  } else {
    throw Exception('Failed to load questions');
  }
}`,
      submit_test: `
Future<TestResult> submitTest(List<Answer> answers) async {
  final response = await http.post(
    Uri.parse('$baseUrl/api/v1/psychology/submit'),
    headers: {'Content-Type': 'application/json'},
    body: json.encode({'answers': answers.map((a) => a.toJson()).toList()}),
  );
  if (response.statusCode == 200) {
    return TestResult.fromJson(json.decode(response.body));
  } else {
    throw Exception('Failed to submit test');
  }
}`
    }
  });
} 