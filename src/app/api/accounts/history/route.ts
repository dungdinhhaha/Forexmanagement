import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    console.log('🔍 GET /api/accounts/history - Request received');
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    console.log('👤 User data:', user ? `ID: ${user.id}` : 'No user found');
    
    if (userError || !user) {
      console.error('🚫 Auth error:', userError || 'No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Lấy lịch sử tài khoản từ database
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('🚫 Error fetching account history:', error);
      return NextResponse.json({ error: 'Failed to fetch account history' }, { status: 500 });
    }

    console.log(`✅ Found ${data?.length || 0} account history entries`);
    
    // Nếu không có dữ liệu, trả về dữ liệu mẫu (có thể xóa sau khi có dữ liệu thật)
    if (!data || data.length === 0) {
      const sampleData = [
        {
          balance: 10000,
          created_at: new Date(Date.now() - 12 * 86400000).toISOString()
        },
        {
          balance: 11500,
          created_at: new Date().toISOString()
        }
      ];
      console.log('⚠️ No account history found, returning sample data');
      return NextResponse.json(sampleData);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 Error server:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 