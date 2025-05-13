'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, LineChart, PieChart } from 'lucide-react';
import { IPsychologyTestResult } from '@/types/psychology';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';

interface PsychologyPageClientProps {
  results: IPsychologyTestResult[];
}

export default function PsychologyPageClient({ results }: PsychologyPageClientProps) {
  const [selectedResult, setSelectedResult] = useState<IPsychologyTestResult | null>(null);

  // Validate results
  if (!Array.isArray(results)) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline"> Dữ liệu không hợp lệ</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tâm lý giao dịch</h1>
              <p className="text-gray-600">Đánh giá và cải thiện tâm lý giao dịch của bạn</p>
            </div>
            <Link
              href="/psychology/test"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Làm bài kiểm tra mới
            </Link>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có kết quả</h3>
              <p className="mt-1 text-sm text-gray-500">
                Bạn chưa có kết quả kiểm tra nào. Hãy làm bài kiểm tra để xem phân tích.
              </p>
              <div className="mt-6">
                <Link
                  href="/psychology/test"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Làm bài kiểm tra
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Kết quả kiểm tra - {format(new Date(result.taken_at), 'PPP', { locale: vi })}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Điểm số: {result.score}/20
                      </p>
                    </div>
                    <Link
                      href={`/psychology/results/${result.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(result.category_scores).map(([category, score]) => {
                      const value = typeof score === 'object' && score !== null && 'score' in score
                        ? (score as any).score
                        : score;
                      return (
                        <div key={category} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900">{category}</p>
                          <p className="text-lg font-semibold text-blue-600">{value}/20</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(value / 20) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 