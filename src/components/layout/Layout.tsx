'use client';

import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  
  // Không hiển thị Header trên trang đăng nhập
  const isAuthPage = pathname?.startsWith('/auth');

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && <Header />}
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 