# Hướng dẫn Kết nối Flutter với Backend API

## 1. Thiết lập Supabase Admin trong Flutter

### 1.1. Cài đặt dependencies

```yaml
dependencies:
  flutter:
    sdk: flutter
  supabase_flutter: ^1.10.25
  http: ^1.1.0
  flutter_secure_storage: ^8.0.0
```

### 1.2. Khởi tạo Supabase Client với Service Role Key

```dart
import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseAdmin {
  static late final SupabaseClient _instance;
  
  static Future<void> initialize() async {
    await Supabase.initialize(
      url: 'https://ivfmfhcehyoeiwhaoxog.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2Zm1maGNlaHlvZWl3aGFveG9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTc2NzMwMiwiZXhwIjoyMDU3MzQzMzAyfQ.y77A7f9fPr7G_8wnZBdjWnZdwxaTdWeDYoVEaK3VoN8',
    );
    
    _instance = Supabase.instance.client;
  }
  
  static SupabaseClient get instance => _instance;
}
```

### 1.3. Lưu trữ token và sử dụng trong API calls

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenManager {
  static final _storage = FlutterSecureStorage();
  
  static Future<void> saveToken(String token) async {
    await _storage.write(key: 'auth_token', value: token);
  }
  
  static Future<String?> getToken() async {
    return await _storage.read(key: 'auth_token');
  }
  
  static Future<void> removeToken() async {
    await _storage.delete(key: 'auth_token');
  }
}
```

## 2. API Service với Xác thực Token

```dart
import 'dart:developer' as developer;
import 'package:http/http.dart' as http;

class ApiService {
  // QUAN TRỌNG: URL mới nhất của API
  final String baseUrl = 'https://forexmanagement1-gkwm79uvg-dungdinhhahas-projects.vercel.app/api';
  
  Future<Map<String, String>> get _headers async {
    final token = await TokenManager.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token != null ? 'Bearer $token' : '',
    };
  }
  
  // Thêm phương thức debug để kiểm tra kết nối
  Future<bool> testConnection() async {
    try {
      developer.log('Testing API connection to: $baseUrl/v1/flutter-test');
      final response = await http.get(
        Uri.parse('$baseUrl/v1/flutter-test'),
      );
      
      developer.log('API test response: ${response.statusCode}, Body: ${response.body.substring(0, min(100, response.body.length))}');
      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (e) {
      developer.log('API connection test failed: $e');
      return false;
    }
  }
  
  Future<dynamic> get(String endpoint) async {
    try {
      final headers = await _headers;
      developer.log('API GET: $baseUrl/$endpoint');
      
      final response = await http.get(
        Uri.parse('$baseUrl/$endpoint'),
        headers: headers,
      );
      
      return _handleResponse(response);
    } catch (e) {
      developer.log('API GET Error: $e');
      rethrow;
    }
  }
  
  Future<dynamic> post(String endpoint, Map<String, dynamic> data) async {
    try {
      final headers = await _headers;
      final response = await http.post(
        Uri.parse('$baseUrl/$endpoint'),
        headers: headers,
        body: jsonEncode(data),
      );
      
      return _handleResponse(response);
    } catch (e) {
      developer.log('API POST Error: $e');
      rethrow;
    }
  }
  
  Future<dynamic> put(String endpoint, Map<String, dynamic> data) async {
    final headers = await _headers;
    final response = await http.put(
      Uri.parse('$baseUrl/$endpoint'),
      headers: headers,
      body: jsonEncode(data),
    );
    
    return _handleResponse(response);
  }
  
  Future<dynamic> delete(String endpoint) async {
    final headers = await _headers;
    final response = await http.delete(
      Uri.parse('$baseUrl/$endpoint'),
      headers: headers,
    );
    
    return _handleResponse(response);
  }
  
  dynamic _handleResponse(http.Response response) {
    developer.log('API Response: ${response.statusCode}, Body: ${response.body.substring(0, min(100, response.body.length))}');
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return null;
      return jsonDecode(response.body);
    } else {
      throw Exception('Request failed with status: ${response.statusCode}\n${response.body}');
    }
  }
}
```

## 3. Methods API

### 3.1. Model

```dart
class Method {
  final String id;
  final String name;
  final String description;
  final List<String> rules;
  final List<String> indicators;
  final List<String> timeframes;
  final DateTime createdAt;
  final DateTime? updatedAt;
  
  Method({
    required this.id,
    required this.name,
    required this.description,
    required this.rules,
    required this.indicators,
    required this.timeframes,
    required this.createdAt,
    this.updatedAt,
  });
  
  factory Method.fromJson(Map<String, dynamic> json) {
    return Method(
      id: json['id'],
      name: json['name'],
      description: json['description'] ?? '',
      rules: List<String>.from(json['rules'] ?? []),
      indicators: List<String>.from(json['indicators'] ?? []),
      timeframes: List<String>.from(json['timeframes'] ?? []),
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'description': description,
      'rules': rules,
      'indicators': indicators,
      'timeframes': timeframes,
    };
  }
}
```

### 3.2. Service

```dart
class MethodService {
  final ApiService _apiService = ApiService();
  
  // Lấy tất cả phương pháp
  Future<List<Method>> getAllMethods() async {
    final response = await _apiService.get('methods');
    return (response as List).map((item) => Method.fromJson(item)).toList();
  }
  
  // Lấy phương pháp theo ID
  Future<Method> getMethodById(String id) async {
    final response = await _apiService.get('methods/$id');
    return Method.fromJson(response);
  }
  
  // Tạo phương pháp mới
  Future<Method> createMethod(Method method) async {
    final response = await _apiService.post('methods', method.toJson());
    return Method.fromJson(response);
  }
  
  // Cập nhật phương pháp
  Future<Method> updateMethod(String id, Method method) async {
    final response = await _apiService.put('methods/$id', method.toJson());
    return Method.fromJson(response);
  }
  
  // Xóa phương pháp
  Future<void> deleteMethod(String id) async {
    await _apiService.delete('methods/$id');
  }
}
```

## 4. Trades API

### 4.1. Model

```dart
enum TradeStatus { open, closed }
enum TradeDirection { long, short }
enum TradeResult { win, loss, breakeven }

class Trade {
  final String id;
  final String? methodId;
  final TradeDirection direction;
  final double entryPrice;
  final double? exitPrice;
  final double riskAmount;
  final double? profitAmount;
  final String pair;
  final TradeStatus status;
  final TradeResult? result;
  final DateTime entryDate;
  final DateTime? exitDate;
  final String? notes;
  final List<String>? images;
  
  Trade({
    required this.id,
    this.methodId,
    required this.direction,
    required this.entryPrice,
    this.exitPrice,
    required this.riskAmount,
    this.profitAmount,
    required this.pair,
    required this.status,
    this.result,
    required this.entryDate,
    this.exitDate,
    this.notes,
    this.images,
  });
  
  factory Trade.fromJson(Map<String, dynamic> json) {
    return Trade(
      id: json['id'],
      methodId: json['method_id'],
      direction: json['direction'] == 'long' ? TradeDirection.long : TradeDirection.short,
      entryPrice: json['entry_price'].toDouble(),
      exitPrice: json['exit_price']?.toDouble(),
      riskAmount: json['risk_amount'].toDouble(),
      profitAmount: json['profit_amount']?.toDouble(),
      pair: json['pair'],
      status: json['status'] == 'closed' ? TradeStatus.closed : TradeStatus.open,
      result: json['result'] == null
          ? null
          : json['result'] == 'win'
              ? TradeResult.win
              : json['result'] == 'loss'
                  ? TradeResult.loss
                  : TradeResult.breakeven,
      entryDate: DateTime.parse(json['entry_date']),
      exitDate: json['exit_date'] != null ? DateTime.parse(json['exit_date']) : null,
      notes: json['notes'],
      images: json['images'] != null ? List<String>.from(json['images']) : null,
    );
  }
  
  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = {
      'method_id': methodId,
      'direction': direction == TradeDirection.long ? 'long' : 'short',
      'entry_price': entryPrice,
      'risk_amount': riskAmount,
      'pair': pair,
      'entry_date': entryDate.toIso8601String(),
      'notes': notes,
      'images': images,
    };
    
    if (exitPrice != null) data['exit_price'] = exitPrice;
    if (profitAmount != null) data['profit_amount'] = profitAmount;
    if (exitDate != null) data['exit_date'] = exitDate!.toIso8601String();
    
    return data;
  }
}
```

### 4.2. Service

```dart
class TradeService {
  final ApiService _apiService = ApiService();
  
  // Lấy tất cả giao dịch
  Future<List<Trade>> getAllTrades({String? methodId}) async {
    String endpoint = 'v1/flutter-trade';
    if (methodId != null) {
      endpoint += '?methodId=$methodId';
    }
    
    final response = await _apiService.get(endpoint);
    return (response as List).map((item) => Trade.fromJson(item)).toList();
  }
  
  // Lấy giao dịch theo ID
  Future<Trade> getTradeById(String id) async {
    final response = await _apiService.get('v1/trades/$id');
    return Trade.fromJson(response);
  }
  
  // Tạo giao dịch mới
  Future<Trade> createTrade(Trade trade) async {
    final response = await _apiService.post('v1/flutter-trade', trade.toJson());
    return Trade.fromJson(response);
  }
  
  // Cập nhật giao dịch
  Future<Trade> updateTrade(String id, Trade trade) async {
    final response = await _apiService.put('v1/trades/$id', trade.toJson());
    return Trade.fromJson(response);
  }
  
  // Đóng giao dịch
  Future<Trade> closeTrade(String id, double exitPrice, {double? profitAmount, String? notes}) async {
    final data = {
      'exit_price': exitPrice,
      'exit_date': DateTime.now().toIso8601String(),
    };
    
    if (profitAmount != null) {
      data['profit_amount'] = profitAmount;
    }
    
    if (notes != null) {
      data['notes'] = notes;
    }
    
    final response = await _apiService.put('v1/trades/$id/close', data);
    return Trade.fromJson(response);
  }
  
  // Xóa giao dịch
  Future<void> deleteTrade(String id) async {
    await _apiService.delete('v1/trades/$id');
  }
  
  // Lấy thống kê giao dịch
  Future<Map<String, dynamic>> getTradeStats({String? methodId}) async {
    String endpoint = 'v1/trades/stats';
    if (methodId != null) {
      endpoint += '?methodId=$methodId';
    }
    
    return await _apiService.get(endpoint);
  }
}
```

## 5. Psychology API

### 5.1. Model

```dart
class PsychologyQuestion {
  final String id;
  final String question;
  final List<String> options;
  final Map<String, int> scoring;
  final String category;
  
  PsychologyQuestion({
    required this.id,
    required this.question,
    required this.options,
    required this.scoring,
    required this.category,
  });
  
  factory PsychologyQuestion.fromJson(Map<String, dynamic> json) {
    return PsychologyQuestion(
      id: json['id'],
      question: json['question'],
      options: List<String>.from(json['options']),
      scoring: Map<String, int>.from(json['scoring']),
      category: json['category'],
    );
  }
}

class PsychologyAnswer {
  final String questionId;
  final String selectedOption;
  
  PsychologyAnswer({
    required this.questionId,
    required this.selectedOption,
  });
  
  Map<String, dynamic> toJson() {
    return {
      'question_id': questionId,
      'selected_option': selectedOption,
    };
  }
}

class PsychologyResult {
  final String id;
  final Map<String, int> scores;
  final Map<String, String> analysis;
  final DateTime createdAt;
  
  PsychologyResult({
    required this.id,
    required this.scores,
    required this.analysis,
    required this.createdAt,
  });
  
  factory PsychologyResult.fromJson(Map<String, dynamic> json) {
    return PsychologyResult(
      id: json['id'],
      scores: Map<String, int>.from(json['scores']),
      analysis: Map<String, String>.from(json['analysis']),
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}
```

### 5.2. Service

```dart
class PsychologyService {
  final ApiService _apiService = ApiService();
  
  // Lấy danh sách câu hỏi tâm lý
  Future<List<PsychologyQuestion>> getQuestions() async {
    // Sử dụng API endpoint đặc biệt cho Flutter
    final response = await _apiService.get('v1/flutter-psychology');
    return (response as List).map((item) => PsychologyQuestion.fromJson(item)).toList();
  }
  
  // Gửi câu trả lời bài test tâm lý
  Future<PsychologyResult> submitTest(List<PsychologyAnswer> answers) async {
    final data = {
      'answers': answers.map((answer) => answer.toJson()).toList(),
    };
    
    // Sử dụng API endpoint đặc biệt cho Flutter
    final response = await _apiService.post('v1/flutter-psychology', data);
    return PsychologyResult.fromJson(response);
  }
  
  // Lấy lịch sử kết quả
  Future<List<PsychologyResult>> getResults() async {
    final response = await _apiService.get('v1/psychology/results');
    return (response as List).map((item) => PsychologyResult.fromJson(item)).toList();
  }
  
  // Lấy chi tiết một kết quả
  Future<PsychologyResult> getResultById(String id) async {
    final response = await _apiService.get('v1/psychology/results/$id');
    return PsychologyResult.fromJson(response);
  }
  
  // Tạo kết quả mẫu
  Future<PsychologyResult> createSampleResult() async {
    final response = await _apiService.post('v1/psychology/sample', {});
    return PsychologyResult.fromJson(response);
  }
}
```

## 6. Triển khai xác thực

### 6.1. Auth Service

```dart
class AuthService {
  // Đăng nhập trực tiếp bằng Supabase
  static Future<void> signIn(String email, String password) async {
    try {
      final response = await SupabaseAdmin.instance.auth.signInWithPassword(
        email: email,
        password: password,
      );
      
      if (response.session != null) {
        await TokenManager.saveToken(response.session!.accessToken);
      } else {
        throw Exception('Không thể đăng nhập: ${response.error?.message}');
      }
    } catch (e) {
      throw Exception('Lỗi đăng nhập: $e');
    }
  }
  
  // Đăng xuất
  static Future<void> signOut() async {
    await SupabaseAdmin.instance.auth.signOut();
    await TokenManager.removeToken();
  }
  
  // Kiểm tra trạng thái đăng nhập
  static Future<bool> isAuthenticated() async {
    final token = await TokenManager.getToken();
    if (token == null) return false;
    
    // Kiểm tra token còn hiệu lực
    try {
      final response = await SupabaseAdmin.instance.auth.getUser();
      return response.user != null;
    } catch (e) {
      return false;
    }
  }
}
```

### 6.2. Tích hợp trong App

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Khởi tạo Supabase
  await SupabaseAdmin.initialize();
  
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Trading Management',
      home: FutureBuilder<bool>(
        future: AuthService.isAuthenticated(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return SplashScreen();
          }
          
          if (snapshot.data == true) {
            return HomeScreen();
          } else {
            return LoginScreen();
          }
        },
      ),
    );
  }
}
```

## 7. Ví dụ gọi API trong UI

### 7.1. Lấy danh sách phương pháp

```dart
class MethodsScreen extends StatefulWidget {
  @override
  _MethodsScreenState createState() => _MethodsScreenState();
}

class _MethodsScreenState extends State<MethodsScreen> {
  final MethodService _methodService = MethodService();
  List<Method> _methods = [];
  bool _isLoading = true;
  
  @override
  void initState() {
    super.initState();
    _loadMethods();
  }
  
  Future<void> _loadMethods() async {
    setState(() {
      _isLoading = true;
    });
    
    try {
      final methods = await _methodService.getAllMethods();
      setState(() {
        _methods = methods;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể tải phương pháp: $e')),
      );
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Phương pháp giao dịch')),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _methods.isEmpty
              ? Center(child: Text('Không có phương pháp nào'))
              : ListView.builder(
                  itemCount: _methods.length,
                  itemBuilder: (context, index) {
                    final method = _methods[index];
                    return ListTile(
                      title: Text(method.name),
                      subtitle: Text(method.description),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => MethodDetailScreen(methodId: method.id),
                          ),
                        );
                      },
                    );
                  },
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => AddMethodScreen()),
          ).then((_) => _loadMethods());
        },
        child: Icon(Icons.add),
      ),
    );
  }
}
```

### 7.2. Làm bài kiểm tra tâm lý

```dart
class PsychologyTestScreen extends StatefulWidget {
  @override
  _PsychologyTestScreenState createState() => _PsychologyTestScreenState();
}

class _PsychologyTestScreenState extends State<PsychologyTestScreen> {
  final PsychologyService _psychologyService = PsychologyService();
  List<PsychologyQuestion> _questions = [];
  Map<String, String> _answers = {};
  bool _isLoading = true;
  
  @override
  void initState() {
    super.initState();
    _loadQuestions();
  }
  
  Future<void> _loadQuestions() async {
    setState(() {
      _isLoading = true;
    });
    
    try {
      final questions = await _psychologyService.getQuestions();
      setState(() {
        _questions = questions;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể tải câu hỏi: $e')),
      );
    }
  }
  
  Future<void> _submitTest() async {
    if (_answers.length < _questions.length) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Vui lòng trả lời tất cả câu hỏi')),
      );
      return;
    }
    
    setState(() {
      _isLoading = true;
    });
    
    try {
      final answers = _answers.entries.map((entry) {
        return PsychologyAnswer(
          questionId: entry.key,
          selectedOption: entry.value,
        );
      }).toList();
      
      final result = await _psychologyService.submitTest(answers);
      
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => PsychologyResultScreen(result: result),
        ),
      );
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể gửi bài kiểm tra: $e')),
      );
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Kiểm tra tâm lý giao dịch')),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _questions.length + 1, // +1 for submit button
              itemBuilder: (context, index) {
                if (index == _questions.length) {
                  return Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: ElevatedButton(
                      onPressed: _submitTest,
                      child: Text('Gửi bài kiểm tra'),
                    ),
                  );
                }
                
                final question = _questions[index];
                return Card(
                  margin: EdgeInsets.all(8.0),
                  child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Câu ${index + 1}: ${question.question}',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 8),
                        ...question.options.map((option) {
                          return RadioListTile<String>(
                            title: Text(option),
                            value: option,
                            groupValue: _answers[question.id],
                            onChanged: (value) {
                              setState(() {
                                _answers[question.id] = value!;
                              });
                            },
                          );
                        }).toList(),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
```

## 8. Lưu ý quan trọng

1. **Supabase Admin**: Sử dụng Service Role Key trong app Flutter để xác thực trực tiếp với Supabase, nhưng cần lưu ý đây là key rất quan trọng và có quyền cao, cần được bảo vệ.

2. **Token Authentication**: Server xác thực JWT token từ Supabase khi gọi các API.

3. **API Endpoints**: Các API chính làm việc với 3 module:
   - `/api/methods`: Quản lý phương pháp giao dịch
   - `/api/trades`: Quản lý các giao dịch
   - `/api/psychology`: Kiểm tra và đánh giá tâm lý giao dịch

4. **Bảo mật**:
   - Không lưu Service Role Key trong mã nguồn trực tiếp
   - Sử dụng flutter_secure_storage để lưu trữ token an toàn
   - Xử lý refresh token và token hết hạn

5. **Error Handling**: Xử lý các lỗi kết nối, lỗi xác thực, và lỗi khi gọi API.

6. **Offline Support**: Xem xét việc thêm hỗ trợ offline cho ứng dụng bằng cách lưu trữ dữ liệu cục bộ và đồng bộ khi có kết nối.

7. **CORS Support**: API đã được cấu hình với CORS headers để hỗ trợ Flutter app:
   - API endpoints đặc biệt cho Flutter ở `/api/v1/flutter-*` đã được tạo với CORS support
   - Sử dụng các endpoints này thay vì API endpoints thông thường để tránh vấn đề CORS
   - Đảm bảo URL API không có dấu `/` trùng lặp (ví dụ: tránh `//api/v1`)

8. **Debug API**: Sử dụng `/api/v1/flutter-test` để kiểm tra kết nối và xác thực:
   ```dart
   final response = await http.get(Uri.parse('$baseUrl/v1/flutter-test'));
   print('API Response: ${response.body}');
   ```

9. **Debug Kết nối API**:
   ```dart
   void debugApiConnection() async {
     try {
       // Test kết nối đến API endpoint test
       final response1 = await http.get(
         Uri.parse('https://forexmanagement1-gkwm79uvg-dungdinhhahas-projects.vercel.app/api/v1/flutter-test'),
       );
       print('API Test Response: ${response1.statusCode}');
       print('API Test Body: ${response1.body}');
       
       // Test Psychology API
       final response2 = await http.get(
         Uri.parse('https://forexmanagement1-gkwm79uvg-dungdinhhahas-projects.vercel.app/api/v1/flutter-psychology'),
       );
       print('Psychology API: ${response2.statusCode}');
       
       // Test Trade API
       final response3 = await http.get(
         Uri.parse('https://forexmanagement1-gkwm79uvg-dungdinhhahas-projects.vercel.app/api/v1/flutter-trade'),
       );
       print('Trade API: ${response3.statusCode}');
     } catch (e) {
       print('Debug API Error: $e');
     }
   }
   ```

10. **Android Network Security**:
    Nếu đang chạy ứng dụng trên Android 9+, cần cấu hình security config để cho phép HTTP API:
    
    ```xml
    <!-- Trong res/xml/network_security_config.xml -->
    <?xml version="1.0" encoding="utf-8"?>
    <network-security-config>
        <base-config cleartextTrafficPermitted="true">
            <trust-anchors>
                <certificates src="system" />
            </trust-anchors>
        </base-config>
    </network-security-config>
    ```
    
    Sau đó trong AndroidManifest.xml:
    ```xml
    <application
        ...
        android:networkSecurityConfig="@xml/network_security_config">
    </application>
    ```

11. **iOS Network Security**:
    Trong Info.plist, thêm:
    ```xml
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
    </dict>
    ``` 