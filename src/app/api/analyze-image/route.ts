import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️ OPENAI_API_KEY is not set. Image analysis features will be disabled.');
}

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json({ 
        error: 'Image analysis service is currently unavailable',
        message: 'OpenAI API key is not configured'
      }, { status: 503 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy ảnh' }, { status: 400 });
    }

    console.log('File info:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Chuyển file thành base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    
    console.log('Base64 image length:', base64Image.length);

    // Log thông tin API call
    console.log('Calling OpenAI API with model:', "gpt-4o-mini");

    try {
      // Gọi GPT-4 Vision API
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Phân tích ảnh biểu đồ trading theo các quy tắc sau:
1. Tên cặp tiền nằm ở góc trái trên của biểu đồ
2. Khung thời gian (timeframe) nằm bên cạnh tên cặp tiền
3. Nếu vùng màu xanh nằm trên màu đỏ thì là lệnh BUY, ngược lại là SELL
4. Điểm giao nhau giữa vùng màu xanh và đỏ là giá entry
5. Giá hiện tại là giá exit
6. Trả về JSON với format:
{
  "pair": "tên cặp tiền",
  "type": "BUY hoặc SELL",
  "entry_price": số,
  "exit_price": số,
  "quantity": 1,
  "profit": số (chênh lệch giá exit - entry),
  "date": "ngày hiện tại",
  "note": "ghi chú phân tích (vd: xu hướng, vùng hỗ trợ/kháng cự)"
}
Chỉ trả về JSON, không kèm text khác.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${file.type};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      });

      console.log('OpenAI API Response:', response);

      // Lấy nội dung JSON từ response
      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('Không nhận được phản hồi từ API');
      }

      console.log('API Response content:', content);

      // Parse JSON từ content
      const tradeData = JSON.parse(content);

      console.log('Parsed trade data:', tradeData);

      // Kiểm tra và chuyển đổi dữ liệu
      const processedData = {
        pair: tradeData.pair || '',
        type: tradeData.type || 'BUY',
        entry_price: parseFloat(tradeData.entry_price) || 0,
        exit_price: parseFloat(tradeData.exit_price) || 0,
        quantity: parseFloat(tradeData.quantity) || 0,
        profit: parseFloat(tradeData.profit) || 0,
        date: tradeData.date || new Date().toISOString().split('T')[0],
        note: tradeData.note || '',
        method_id: '',
        screenshot: ''
      };

      console.log('Processed data:', processedData);

      return NextResponse.json(processedData);
    } catch (apiError: any) {
      console.error('OpenAI API Error:', apiError);
      throw new Error(`OpenAI API Error: ${apiError?.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    const errorDetails = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : error;
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Lỗi khi phân tích ảnh',
        details: JSON.stringify(errorDetails, null, 2)
      },
      { status: 500 }
    );
  }
} 