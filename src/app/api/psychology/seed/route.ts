import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';
import { serverAuthService } from '@/services/ServerAuthService';
import { PsychologyRepository } from '@/repositories/PsychologyRepository';

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

const psychologyRepository = new PsychologyRepository();

export async function POST() {
  try {
    const userId = await serverAuthService.getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Sample test results
    const sampleResults = [
      {
        user_id: userId,
        taken_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        category_scores: {
          risk_management: 4,
          emotional_control: 3,
          discipline: 5
        },
        score: 12,
        analysis: "Bạn có khả năng quản lý rủi ro tốt và tính kỷ luật cao. Tuy nhiên, cần cải thiện khả năng kiểm soát cảm xúc.",
        recommendations: [
          "Thực hành các kỹ thuật thiền định để cải thiện kiểm soát cảm xúc",
          "Duy trì thói quen ghi chép nhật ký giao dịch",
          "Tham gia các buổi thảo luận về tâm lý giao dịch"
        ]
      },
      {
        user_id: userId,
        taken_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        category_scores: {
          risk_management: 3,
          emotional_control: 4,
          discipline: 3
        },
        score: 10,
        analysis: "Bạn có khả năng kiểm soát cảm xúc tốt, nhưng cần cải thiện về quản lý rủi ro và tính kỷ luật.",
        recommendations: [
          "Học thêm về quản lý vốn và rủi ro",
          "Tạo và tuân thủ kế hoạch giao dịch chi tiết",
          "Tham gia các khóa học về tâm lý giao dịch"
        ]
      }
    ];

    // Insert sample results
    const results = await Promise.all(
      sampleResults.map(result => psychologyRepository.saveTestResult(userId, result))
    );

    return NextResponse.json({ message: 'Sample data created successfully', results });
  } catch (error) {
    console.error('Error seeding sample data:', error);
    return NextResponse.json({ error: 'Failed to create sample data' }, { status: 500 });
  }
} 