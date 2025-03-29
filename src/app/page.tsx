'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Hệ thống Quản lý Giao dịch
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Quản lý và phân tích phương pháp giao dịch forex của bạn một cách hiệu quả với sự hỗ trợ của AI.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/dashboard"
              className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Bắt đầu
            </Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
              Tìm hiểu thêm <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 