import { psychologyController } from '@/controllers/server/psychology.controller';
import PsychologyPageClient from './PsychologyPageClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function PsychologyPage() {
  try {
    // Xác thực người dùng
    const auth = await psychologyController.authenticate();
    
    if (!auth.authenticated) {
      redirect('/login?returnUrl=/psychology');
    }
    
    return <PsychologyPageClient userId={auth.userId!} />;
  } catch (error) {
    console.error('Error in PsychologyPage:', error);
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> Có lỗi xảy ra khi tải dữ liệu</span>
        </div>
      </div>
    );
  }
}

export default PsychologyPage; 