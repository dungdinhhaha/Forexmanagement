import { NextRequest, NextResponse } from 'next/server';
import { methodController } from '@/controllers/server/method.controller';

// POST /api/methods/new - Tạo phương pháp nhanh với template
export async function POST(request: NextRequest) {
  try {
    const auth = await methodController.authenticate();
    
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }
    
    const body = await request.json();
    const templateId = body.templateId;
    
    // Lấy template dựa vào ID (có thể lưu các templates trong DB)
    // Đây là mẫu đơn giản
    const templateData = {
      name: "Phương pháp mới từ template",
      description: "Được tạo từ template",
      rules: ["Quy tắc mặc định 1", "Quy tắc mặc định 2"],
      indicators: ["RSI", "MACD"],
      timeframes: ["H4", "D1"]
    };
    
    const method = await methodController.createMethod(
      new NextRequest(request.url, {
        body: JSON.stringify(templateData),
        headers: request.headers,
        method: 'POST'
      })
    );
    
    return method;
  } catch (error) {
    console.error('💥 API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 