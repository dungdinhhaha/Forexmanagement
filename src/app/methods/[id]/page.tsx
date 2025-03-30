import { methodService } from '@/services/server/method.service';
import MethodDetailClient from './MethodDetailClient';
import { Loader2 } from 'lucide-react';
import { Metadata } from 'next';

interface PageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Phương pháp ${params.id}`,
    description: 'Chi tiết phương pháp giao dịch',
  }
}

async function MethodDetailPage(props: PageProps) {
  const { params } = props;
  
  try {
    // Authenticate user
    const { authenticated, userId, error: authError } = await methodService.authenticate();
    
    if (!authenticated || !userId) {
      return (
        <div className="container mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline"> {authError || 'Bạn cần đăng nhập để xem nội dung này'}</span>
          </div>
        </div>
      );
    }

    // Fetch method data
    const method = await methodService.getMethodById(params.id, userId);
    
    // Fetch stats data
    const stats = await methodService.getMethodStats(params.id, userId);

    if (!method) {
      return (
        <div className="container mx-auto p-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <span>Không tìm thấy phương pháp</span>
          </div>
        </div>
      );
    }

    return <MethodDetailClient method={method} stats={stats} />;
  } catch (error) {
    console.error('Error loading method:', error);
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> Có lỗi xảy ra khi tải dữ liệu phương pháp</span>
        </div>
      </div>
    );
  }
}

export default MethodDetailPage; 