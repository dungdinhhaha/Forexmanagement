import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    message: "Flutter Integration Examples",
    description: "Example code for integrating a Flutter app with this API",
    examples: {
      api_client: {
        title: "API Client Class",
        description: "Base API client class for Flutter",
        dart_code: `
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiClient {
  final String baseUrl;
  final FlutterSecureStorage secureStorage = const FlutterSecureStorage();
  
  ApiClient({required this.baseUrl});
  
  // Get auth headers with token if available
  Future<Map<String, String>> _getHeaders() async {
    final headers = {
      'Content-Type': 'application/json',
    };
    
    final token = await secureStorage.read(key: 'access_token');
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    
    return headers;
  }
  
  // GET request with auth
  Future<dynamic> get(String endpoint) async {
    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
    );
    
    return _handleResponse(response);
  }
  
  // POST request with auth
  Future<dynamic> post(String endpoint, {Map<String, dynamic>? body}) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
      body: body != null ? json.encode(body) : null,
    );
    
    return _handleResponse(response);
  }
  
  // Handle API response
  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return {};
      return json.decode(response.body);
    } else if (response.statusCode == 401) {
      // Unauthorized - token might be expired
      // You might want to implement token refresh here
      throw UnauthorizedException('Unauthorized. Please log in again.');
    } else {
      try {
        final errorData = json.decode(response.body);
        throw ApiException(
          errorData['error'] ?? 'Unknown error',
          response.statusCode,
        );
      } catch (_) {
        throw ApiException(
          'Request failed with status code ${response.statusCode}',
          response.statusCode,
        );
      }
    }
  }
}

// Custom exceptions
class ApiException implements Exception {
  final String message;
  final int statusCode;
  
  ApiException(this.message, this.statusCode);
  
  @override
  String toString() => 'ApiException: $message (Status code: $statusCode)';
}

class UnauthorizedException implements Exception {
  final String message;
  
  UnauthorizedException(this.message);
  
  @override
  String toString() => 'UnauthorizedException: $message';
}
`
      },
      auth_service: {
        title: "Authentication Service",
        description: "Service for handling authentication in Flutter",
        dart_code: `
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'api_client.dart';

class User {
  final String id;
  final String email;
  final String? role;
  
  User({required this.id, required this.email, this.role});
  
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      role: json['role'],
    );
  }
}

class AuthService with ChangeNotifier {
  final ApiClient _apiClient;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();
  User? _currentUser;
  bool _isLoading = false;
  
  AuthService(this._apiClient);
  
  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _currentUser != null;
  
  // Check if user is logged in
  Future<bool> checkAuthStatus() async {
    try {
      _isLoading = true;
      notifyListeners();
      
      final response = await _apiClient.get('/api/v1/auth/flutter?check_auth=true');
      final bool authenticated = response['authenticated'] ?? false;
      
      if (authenticated && response['user'] != null) {
        _currentUser = User.fromJson(response['user']);
        notifyListeners();
        return true;
      } else {
        _currentUser = null;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _currentUser = null;
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Login user
  Future<User> login(String email, String password) async {
    try {
      _isLoading = true;
      notifyListeners();
      
      final response = await _apiClient.post('/api/v1/auth/flutter', body: {
        'email': email,
        'password': password,
      });
      
      // Save tokens
      await _secureStorage.write(
        key: 'access_token',
        value: response['session']['access_token'],
      );
      await _secureStorage.write(
        key: 'refresh_token',
        value: response['session']['refresh_token'],
      );
      
      // Set user
      _currentUser = User.fromJson(response['user']);
      notifyListeners();
      return _currentUser!;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Register new user
  Future<void> register(String email, String password, {String? name}) async {
    try {
      _isLoading = true;
      notifyListeners();
      
      final body = {
        'email': email,
        'password': password,
      };
      
      if (name != null) {
        body['name'] = name;
      }
      
      await _apiClient.post('/api/v1/auth/flutter/signup', body: body);
      // Note: User might need to confirm email before logging in,
      // depending on your Supabase configuration
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Logout user
  Future<void> logout() async {
    try {
      _isLoading = true;
      notifyListeners();
      
      await _apiClient.post('/api/v1/auth/flutter/logout');
      
      // Clear tokens
      await _secureStorage.delete(key: 'access_token');
      await _secureStorage.delete(key: 'refresh_token');
      
      _currentUser = null;
      notifyListeners();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Refresh token
  Future<bool> refreshToken() async {
    try {
      final refreshToken = await _secureStorage.read(key: 'refresh_token');
      if (refreshToken == null) return false;
      
      final response = await _apiClient.post('/api/v1/auth/flutter/refresh', body: {
        'refresh_token': refreshToken,
      });
      
      // Save new tokens
      await _secureStorage.write(
        key: 'access_token',
        value: response['session']['access_token'],
      );
      await _secureStorage.write(
        key: 'refresh_token',
        value: response['session']['refresh_token'],
      );
      
      // Update user
      _currentUser = User.fromJson(response['user']);
      notifyListeners();
      return true;
    } catch (e) {
      return false;
    }
  }
}
`
      },
      psychology_service: {
        title: "Psychology Service",
        description: "Service for interacting with the psychology API in Flutter",
        dart_code: `
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'api_client.dart';

// Models
class PsychologyQuestion {
  final String id;
  final String question;
  final String category;
  final List<PsychologyAnswer> answers;
  final String createdAt;
  
  PsychologyQuestion({
    required this.id,
    required this.question,
    required this.category,
    required this.answers,
    required this.createdAt,
  });
  
  factory PsychologyQuestion.fromJson(Map<String, dynamic> json) {
    return PsychologyQuestion(
      id: json['id'],
      question: json['question'],
      category: json['category'],
      answers: (json['answers'] as List)
          .map((answer) => PsychologyAnswer.fromJson(answer))
          .toList(),
      createdAt: json['created_at'],
    );
  }
}

class PsychologyAnswer {
  final String text;
  final int score;
  
  PsychologyAnswer({required this.text, required this.score});
  
  factory PsychologyAnswer.fromJson(Map<String, dynamic> json) {
    return PsychologyAnswer(
      text: json['text'],
      score: json['score'],
    );
  }
}

class TestResult {
  final String id;
  final String userId;
  final double score;
  final Map<String, double> categoryScores;
  final String analysis;
  final List<String> recommendations;
  final String takenAt;
  final String? createdAt;
  
  TestResult({
    required this.id,
    required this.userId,
    required this.score,
    required this.categoryScores,
    required this.analysis,
    required this.recommendations,
    required this.takenAt,
    this.createdAt,
  });
  
  factory TestResult.fromJson(Map<String, dynamic> json) {
    // Handle category_scores
    final categoryScoresJson = json['category_scores'] as Map<String, dynamic>;
    final categoryScores = categoryScoresJson.map(
      (key, value) => MapEntry(key, (value as num).toDouble()),
    );
    
    return TestResult(
      id: json['id'],
      userId: json['user_id'],
      score: (json['score'] as num).toDouble(),
      categoryScores: categoryScores,
      analysis: json['analysis'],
      recommendations: (json['recommendations'] as List)
          .map((rec) => rec as String)
          .toList(),
      takenAt: json['taken_at'],
      createdAt: json['created_at'],
    );
  }
}

class TestAnswer {
  final String questionId;
  final int answerIndex;
  
  TestAnswer({required this.questionId, required this.answerIndex});
  
  Map<String, dynamic> toJson() {
    return {
      'questionId': questionId,
      'answerIndex': answerIndex,
    };
  }
}

// Service
class PsychologyService with ChangeNotifier {
  final ApiClient _apiClient;
  List<PsychologyQuestion> _questions = [];
  List<TestResult> _results = [];
  TestResult? _currentResult;
  bool _isLoading = false;
  String? _error;
  
  PsychologyService(this._apiClient);
  
  // Getters
  List<PsychologyQuestion> get questions => _questions;
  List<TestResult> get results => _results;
  TestResult? get currentResult => _currentResult;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  // Fetch questions
  Future<List<PsychologyQuestion>> getQuestions() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();
      
      final response = await _apiClient.get('/api/v1/psychology/questions');
      
      _questions = (response as List)
          .map((question) => PsychologyQuestion.fromJson(question))
          .toList();
          
      notifyListeners();
      return _questions;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      throw e;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Fetch test results
  Future<List<TestResult>> getTestResults() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();
      
      final response = await _apiClient.get('/api/v1/psychology/results');
      
      _results = (response as List)
          .map((result) => TestResult.fromJson(result))
          .toList();
          
      notifyListeners();
      return _results;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      throw e;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Fetch test result by ID
  Future<TestResult> getTestResultById(String id) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();
      
      final response = await _apiClient.get('/api/v1/psychology/results/$id');
      
      _currentResult = TestResult.fromJson(response);
      notifyListeners();
      return _currentResult!;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      throw e;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Submit test answers
  Future<TestResult> submitTest(List<TestAnswer> answers) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();
      
      final response = await _apiClient.post(
        '/api/v1/psychology/submit',
        body: {
          'answers': answers.map((answer) => answer.toJson()).toList(),
        },
      );
      
      _currentResult = TestResult.fromJson(response);
      
      // Refresh results list
      await getTestResults();
      
      return _currentResult!;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      throw e;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Create sample result for testing
  Future<TestResult> createSampleResult() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();
      
      final response = await _apiClient.post('/api/v1/psychology/sample');
      
      _currentResult = TestResult.fromJson(response);
      
      // Refresh results list
      await getTestResults();
      
      return _currentResult!;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      throw e;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
`
      },
      app_setup: {
        title: "Flutter App Setup",
        description: "Main setup for a Flutter app using the API",
        dart_code: `
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/api_client.dart';
import 'services/auth_service.dart';
import 'services/psychology_service.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Create API client with your server URL
    final apiClient = ApiClient(baseUrl: 'https://your-server-url.com');
    
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthService(apiClient),
        ),
        ChangeNotifierProvider(
          create: (_) => PsychologyService(apiClient),
        ),
      ],
      child: MaterialApp(
        title: 'Trading Psychology App',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        home: AuthWrapper(),
      ),
    );
  }
}

class AuthWrapper extends StatefulWidget {
  @override
  _AuthWrapperState createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  @override
  void initState() {
    super.initState();
    // Check authentication status when app starts
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<AuthService>(context, listen: false).checkAuthStatus();
    });
  }
  
  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    
    // Show loading indicator
    if (authService.isLoading) {
      return Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }
    
    // Navigate based on authentication status
    return authService.isAuthenticated
        ? HomePage()
        : LoginPage();
  }
}

// You would implement LoginPage, HomePage, and other screens
// based on your app's requirements
`
      }
    }
  });
} 