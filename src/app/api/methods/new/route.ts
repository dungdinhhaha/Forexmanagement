import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { serverAuthService } from '@/services/ServerAuthService';

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// POST /api/methods/new - Tạo phương pháp mới
export async function POST(request: NextRequest) {
  try {
    // Lấy userId thực tế từ auth
    const userId = await serverAuthService.getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { name, description, rules, indicators, timeframes, recommendations, total_trades, win_trades, lose_trades, draw_trades } = body;

    const { data, error } = await supabase
      .from('trade_methods')
      .insert([
        {
          user_id: userId,
          name,
          description,
          rules,
          indicators,
          timeframes,
          recommendations: recommendations || [],
          total_trades: total_trades || 0,
          win_trades: win_trades || 0,
          lose_trades: lose_trades || 0,
          draw_trades: draw_trades || 0,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, method: data });
  } catch (error) {
    console.error('💥 API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 