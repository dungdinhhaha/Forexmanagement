import { psychologyService } from '@/services/PsychologyService';
import ResultDetailClient from './ResultDetailClient';
import { Loader2, AlertCircle, AlertTriangle } from 'lucide-react';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';

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
    title: `Kết quả test tâm lý`,
    description: 'Chi tiết kết quả bài test tâm lý',
  }
}

function LoadingState() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Đang tải kết quả...</span>
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ message, type = 'error' }: { message: string; type?: 'error' | 'warning' }) {
  const Icon = type === 'error' ? AlertCircle : AlertTriangle;
  const bgColor = type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700';
  
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className={`${bgColor} border px-4 py-3 rounded relative`} role="alert">
          <div className="flex items-center">
            <Icon className="h-5 w-5 mr-2" />
            <strong className="font-bold">{type === 'error' ? 'Lỗi!' : 'Thông báo'}</strong>
          </div>
          <span className="block sm:inline mt-1">{message}</span>
        </div>
      </div>
    </div>
  );
}

async function ResultDetailPage(props: PageProps) {
  const { params } = props;
  
  try {
    // Authenticate user
    const { authenticated, userId } = await psychologyService.authenticate();
    
    if (!authenticated || !userId) {
      redirect('/login?returnUrl=/psychology/results/' + params.id);
    }

    // Fetch test result data
    const result = await psychologyService.getTestResultById(params.id);
    
    if (!result) {
      return <ErrorMessage message="Không tìm thấy kết quả test" type="warning" />;
    }

    return (
      <Suspense fallback={<LoadingState />}>
        <ResultDetailClient result={result} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading test result:', error);
    return <ErrorMessage message="Có lỗi xảy ra khi tải dữ liệu kết quả test" />;
  }
}

export default ResultDetailPage; 