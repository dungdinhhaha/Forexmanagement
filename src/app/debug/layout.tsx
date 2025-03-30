import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Debug - QLPP',
  description: 'Trang debug và kiểm tra trạng thái ứng dụng',
};

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lấy headers để kiểm tra quyền truy cập
  const headersList = headers();
  const referer = headersList.get('referer') || '';
  
  // Trong môi trường production, có thể giới hạn quyền truy cập vào trang debug
  // Ví dụ: chỉ cho phép truy cập từ một số IP hoặc nếu có mật khẩu
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Trong ví dụ này, ta vẫn cho phép truy cập và chỉ hiển thị cảnh báo
  
  return (
    <div className={inter.className}>
      <Header />
      
      {isProduction && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002.0v-3a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Bạn đang truy cập trang debug trong môi trường production. Thông tin hiển thị có thể bao gồm dữ liệu nhạy cảm.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
} 