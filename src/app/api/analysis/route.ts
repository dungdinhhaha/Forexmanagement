import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️ OPENAI_API_KEY is not set. Analysis features will be disabled.');
}

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/analysis - Request received');
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    console.log('👤 User data:', user ? `ID: ${user.id}` : 'No user found');
    
    if (userError || !user) {
      console.error('🚫 Auth error:', userError || 'No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!openai) {
      return NextResponse.json({ 
        error: 'Analysis service is currently unavailable',
        message: 'OpenAI API key is not configured'
      }, { status: 503 });
    }

    const body = await request.json();
    const { type, data } = body;
    console.log('📄 Analysis request:', { type, data });

    switch (type) {
      case 'market': {
        const { pair, timeframe } = data;
        const prompt = `Phân tích thị trường cho cặp tiền ${pair} trên khung thời gian ${timeframe}:
1. Xu hướng hiện tại
2. Các mức hỗ trợ và kháng cự chính
3. Các chỉ báo kỹ thuật quan trọng
4. Các yếu tố cơ bản ảnh hưởng
5. Dự báo ngắn hạn`;

        console.log('🤖 Calling OpenAI with prompt');
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        });

        console.log('✅ Analysis completed');
        return NextResponse.json({ result: completion.choices[0].message.content });
      }
      default:
        console.error('🚫 Invalid analysis type:', type);
        return NextResponse.json({ error: 'Loại phân tích không hợp lệ' }, { status: 400 });
    }
  } catch (error) {
    console.error('💥 Error in analysis API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 