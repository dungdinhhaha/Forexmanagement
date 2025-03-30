import { psychologyController } from '@/controllers/server/psychology.controller';
import { redirect } from 'next/navigation';
import ResultsPageClient from './ResultsPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function PsychologyResultsPage() {
  try {
    // Xác thực người dùng
    const auth = await psychologyController.authenticate();
    
    if (!auth.authenticated) {
      redirect('/login?returnUrl=/psychology/results');
    }
    
    // Lấy danh sách kết quả kiểm tra
    const results = await psychologyController.getTestResults();
    
    return <ResultsPageClient results={results} />;
  } catch (error) {
    console.error('Error in PsychologyResultsPage:', error);
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> Có lỗi xảy ra khi tải danh sách kết quả kiểm tra</span>
        </div>
      </div>
    );
  }
}

export default PsychologyResultsPage; 