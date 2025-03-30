import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { psychologyController } from '@/controllers/server/psychology.controller';
import ResultDetailClient from './ResultDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Kết quả kiểm tra tâm lý #${params.id}`,
    description: 'Chi tiết kết quả bài kiểm tra tâm lý giao dịch',
  };
}

export default async function ResultDetailPage({ params }: PageProps) {
  try {
    // Xác thực người dùng và lấy userId
    const auth = await psychologyController.authenticate();
    
    if (!auth.authenticated) {
      // Chuyển hướng đến trang đăng nhập nếu chưa xác thực
      redirect('/login?returnUrl=/psychology/results/' + params.id);
    }
    
    const userId = auth.userId!;

    // Lấy kết quả kiểm tra theo ID
    const resultResponse = await psychologyController.getTestResultById(params.id);
    
    // Kiểm tra nếu kết quả là NextResponse, lấy dữ liệu từ nó
    const resultData = resultResponse instanceof Response 
      ? await resultResponse.json() 
      : resultResponse;
    
    // Kiểm tra lỗi
    if (resultData.error || !resultData) {
      notFound();
    }

    return <ResultDetailClient result={resultData} />;
  } catch (error) {
    console.error('Error in psychology result detail page:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Có lỗi xảy ra</h1>
          <p className="text-gray-700">
            Không thể tải kết quả kiểm tra. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
          </p>
        </div>
      </div>
    );
  }
} 