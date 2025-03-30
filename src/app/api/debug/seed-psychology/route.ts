import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Dữ liệu mẫu cho câu hỏi
const sampleQuestions = [
  {
    question: 'Khi một giao dịch đang thua lỗ và vượt quá mức stop loss của bạn, bạn thường làm gì?',
    category: 'risk_management',
    answers: [
      { text: 'Bỏ qua stop loss và đợi thị trường quay lại', score: 0 },
      { text: 'Thêm vốn để trung bình giá xuống', score: 1 },
      { text: 'Chốt lỗ ngay lập tức theo kế hoạch', score: 3 },
      { text: 'Giảm kích thước vị thế nhưng vẫn giữ giao dịch', score: 2 }
    ]
  },
  {
    question: 'Khi cảm thấy căng thẳng hoặc lo lắng về thị trường, bạn thường phản ứng như thế nào?',
    category: 'emotional_control',
    answers: [
      { text: 'Giao dịch nhiều hơn để bù đắp cảm giác lo lắng', score: 0 },
      { text: 'Tạm ngừng giao dịch và tập trung vào việc điều chỉnh cảm xúc', score: 3 },
      { text: 'Tiếp tục giao dịch nhưng giảm kích thước vị thế', score: 2 },
      { text: 'Tìm kiếm lời khuyên từ những người khác ngay lập tức', score: 1 }
    ]
  },
  {
    question: 'Làm thế nào bạn quyết định kích thước vị thế cho mỗi giao dịch?',
    category: 'discipline',
    answers: [
      { text: 'Dựa trên cảm giác về cơ hội giao dịch', score: 0 },
      { text: 'Luôn sử dụng một tỷ lệ cố định của vốn (ví dụ: 1-2%)', score: 3 },
      { text: 'Tăng kích thước khi cảm thấy tự tin về giao dịch', score: 1 },
      { text: 'Dựa trên khoảng cách đến mức stop loss', score: 2 }
    ]
  }
];

export async function GET() {
  try {
    const supabase = await createAdminClient();
    
    if (!supabase) {
      return NextResponse.json({
        status: 'error',
        message: 'Supabase admin client không được khởi tạo',
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
    
    // Xóa dữ liệu cũ (nếu có)
    const { error: deleteError } = await supabase
      .from('psychology_questions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Điều kiện luôn đúng để xóa tất cả
    
    if (deleteError) {
      return NextResponse.json({
        status: 'error',
        message: 'Lỗi khi xóa dữ liệu cũ',
        error: deleteError.message,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
    
    // Thêm dữ liệu mẫu
    const { data, error } = await supabase
      .from('psychology_questions')
      .insert(sampleQuestions)
      .select();
      
    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Lỗi khi thêm dữ liệu mẫu',
        error: error.message,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Đã seed dữ liệu psychology thành công',
      data: {
        inserted: data.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error seeding psychology data:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Lỗi khi seed dữ liệu psychology',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 