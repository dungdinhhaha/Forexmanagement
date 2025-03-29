'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">QLPP</h1>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className={`${
                  pathname === '/dashboard'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation('/trades')}
                className={`${
                  pathname === '/trades'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Trades
              </button>
              <button
                onClick={() => handleNavigation('/methods')}
                className={`${
                  pathname === '/methods'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Methods
              </button>
              <button
                onClick={() => handleNavigation('/analysis')}
                className={`${
                  pathname === '/analysis'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Analysis
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
} 