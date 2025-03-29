import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Sử dụng user_id cố định
    const FIXED_USER_ID = 'd0c0c0c0-0000-0000-0000-000000000000';

    // Tạo dữ liệu mẫu
    const sampleData = [
      {
        user_id: FIXED_USER_ID,
        balance: 10000,
        profit_loss: 0,
        win_rate: 0,
        total_trades: 0,
        successful_trades: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        user_id: FIXED_USER_ID,
        balance: 10500,
        profit_loss: 500,
        win_rate: 60,
        total_trades: 10,
        successful_trades: 6,
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 ngày trước
        updated_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        user_id: FIXED_USER_ID,
        balance: 11000,
        profit_loss: 1000,
        win_rate: 65,
        total_trades: 20,
        successful_trades: 13,
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 ngày trước
        updated_at: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    // Thêm dữ liệu mẫu vào bảng accounts
    const { data, error } = await supabase
      .from('accounts')
      .insert(sampleData)
      .select();

    if (error) {
      console.error('Lỗi khi thêm dữ liệu mẫu:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Đã thêm dữ liệu mẫu thành công', data });
  } catch (error) {
    console.error('Lỗi server:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 