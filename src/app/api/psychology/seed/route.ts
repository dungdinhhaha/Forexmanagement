import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Kiểm tra biến môi trường Supabase
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ Supabase environment variables are not set. Psychology seed features will be disabled.');
}

const sampleQuestions = [
  {
    question: 'Khi thị trường biến động mạnh, bạn thường:',
    category: 'emotional_control',
    answers: [
      { text: 'Hoảng loạn và đóng tất cả các vị thế', score: 20 },
      { text: 'Lo lắng nhưng vẫn giữ vị thế theo kế hoạch', score: 60 },
      { text: 'Bình tĩnh phân tích và điều chỉnh chiến lược', score: 80 },
      { text: 'Thấy cơ hội và tăng vị thế', score: 40 }
    ]
  },
  {
    question: 'Khi gặp thua lỗ, bạn thường:',
    category: 'emotional_control',
    answers: [
      { text: 'Tức giận và muốn gỡ lại ngay lập tức', score: 20 },
      { text: 'Buồn bã và ngừng giao dịch một thời gian', score: 40 },
      { text: 'Phân tích lỗi và rút kinh nghiệm', score: 80 },
      { text: 'Bỏ qua và tiếp tục giao dịch', score: 60 }
    ]
  },
  {
    question: 'Bạn thường đặt stop loss:',
    category: 'risk_management',
    answers: [
      { text: 'Không đặt stop loss', score: 20 },
      { text: 'Đặt stop loss quá xa hoặc quá gần', score: 40 },
      { text: 'Đặt stop loss dựa trên phân tích kỹ thuật', score: 80 },
      { text: 'Đặt stop loss theo cảm tính', score: 60 }
    ]
  },
  {
    question: 'Khi quản lý vốn, bạn thường:',
    category: 'risk_management',
    answers: [
      { text: 'Đặt toàn bộ vốn vào một giao dịch', score: 20 },
      { text: 'Rủi ro 5-10% vốn mỗi giao dịch', score: 40 },
      { text: 'Rủi ro 1-2% vốn mỗi giao dịch', score: 80 },
      { text: 'Rủi ro theo cảm tính', score: 60 }
    ]
  },
  {
    question: 'Bạn có thường xuyên viết nhật ký giao dịch không?',
    category: 'discipline',
    answers: [
      { text: 'Không bao giờ', score: 20 },
      { text: 'Thỉnh thoảng', score: 40 },
      { text: 'Hầu như mỗi ngày', score: 80 },
      { text: 'Chỉ khi có giao dịch quan trọng', score: 60 }
    ]
  },
  {
    question: 'Bạn có tuân thủ kế hoạch giao dịch không?',
    category: 'discipline',
    answers: [
      { text: 'Không có kế hoạch', score: 20 },
      { text: 'Có kế hoạch nhưng thường xuyên phá vỡ', score: 40 },
      { text: 'Tuân thủ nghiêm ngặt kế hoạch', score: 80 },
      { text: 'Tuân thủ một phần', score: 60 }
    ]
  }
];

export async function POST() {
  try {
    // Kiểm tra supabaseAdmin có tồn tại không
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Psychology seed service is currently unavailable',
        message: 'Supabase client is not configured'
      }, { status: 503 });
    }

    // Xóa tất cả câu hỏi cũ
    const { error: deleteError } = await supabaseAdmin
      .from('psychology_questions')
      .delete()
      .neq('id', 0);

    if (deleteError) {
      throw deleteError;
    }

    // Thêm câu hỏi mẫu
    const { data, error } = await supabaseAdmin
      .from('psychology_questions')
      .insert(sampleQuestions)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Đã thêm câu hỏi mẫu thành công', data });
  } catch (error) {
    console.error('Error in POST /api/psychology/seed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 