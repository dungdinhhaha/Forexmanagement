import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { TradeMethod } from '@/types/method';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'analyzeMethod': {
        const { method, stats } = data;
        const prompt = `Phân tích phương pháp giao dịch sau:
Tên: ${method.name}
Mô tả: ${method.description}
Quy tắc: ${method.rules}
Chỉ báo: ${method.indicators}
Khung thời gian: ${method.timeframes}

Thống kê:
- Tổng số giao dịch: ${stats.total_trades}
- Tỷ lệ thắng: ${stats.win_rate}%
- Tổng lợi nhuận: $${stats.total_profit}
- Lợi nhuận trung bình: $${stats.avg_profit}

Hãy phân tích chi tiết về:
1. Hiệu quả của phương pháp
2. Điểm mạnh và điểm yếu
3. Đề xuất cải thiện`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        });

        return NextResponse.json({ result: completion.choices[0].message.content });
      }

      case 'analyzeMarket': {
        const { pair, timeframe } = data;
        const prompt = `Phân tích thị trường cho cặp tiền ${pair} trên khung thời gian ${timeframe}:
1. Xu hướng hiện tại
2. Các mức hỗ trợ và kháng cự chính
3. Các chỉ báo kỹ thuật quan trọng
4. Các yếu tố cơ bản ảnh hưởng
5. Dự báo ngắn hạn`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        });

        return NextResponse.json({ result: completion.choices[0].message.content });
      }

      default:
        return NextResponse.json({ error: 'Loại phân tích không hợp lệ' }, { status: 400 });
    }
  } catch (error) {
    console.error('Lỗi khi gọi GPT API:', error);
    return NextResponse.json({ error: 'Không thể thực hiện phân tích' }, { status: 500 });
  }
} 