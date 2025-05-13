import { Metadata } from 'next';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { psychologyService } from '@/services/PsychologyService';
import { redirect } from 'next/navigation';
import PsychologyPageClient from './PsychologyPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Tâm lý giao dịch',
  description: 'Đánh giá và cải thiện tâm lý giao dịch của bạn',
};

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-40 mt-4 md:mt-0" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

async function PsychologyPage() {
  try {
    // Authenticate user
    const { authenticated, userId } = await psychologyService.authenticate();
    
    if (!authenticated || !userId) {
      redirect('/login?returnUrl=/psychology');
    }

    // Fetch test results
    const results = await psychologyService.getTestResults();
    
    return (
      <Suspense fallback={<LoadingSkeleton />}>
        <PsychologyPageClient results={results || []} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in PsychologyPage:', error);
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline"> Có lỗi xảy ra khi tải dữ liệu</span>
            <p className="mt-2 text-sm">
              Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default PsychologyPage; 