'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IPsychologyTestResult } from '@/interfaces/psychology.interface';
import { psychologyService } from '@/services/PsychologyService';
import { Loader2, ArrowLeft, Clock, BarChart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ResultDetailClientProps {
  result: IPsychologyTestResult;
}

export default function ResultDetailClient({ result }: ResultDetailClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Helper functions
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // View - UI rendering
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <strong className="font-bold">Lỗi!</strong>
          </div>
          <span className="block sm:inline mt-1">{error}</span>
        </div>
        <Button className="mt-4" variant="outline" onClick={() => router.push('/psychology/results')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <Link href="/psychology/results" className="text-gray-600 hover:text-gray-900 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Quay lại danh sách
        </Link>
              </div>

      {/* Content */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Kết quả test tâm lý</h1>
        <div className="text-sm text-gray-500 mb-4 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Thực hiện lúc: {formatDate(result.taken_at || result.created_at)}
              </div>

        {/* Tổng điểm */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-primary" />
              Tổng điểm
            </h2>
            <div className="text-sm text-gray-600">
              {result.score}/15
            </div>
          </div>
          <Progress 
            value={typeof result.score === 'number' ? (result.score / 15) * 100 : 0} 
            className="h-2"
          />
                    </div>

        {/* Kết quả theo từng nhóm */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Kết quả theo nhóm</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {result.category_scores && Object.entries(result.category_scores).length > 0 ? (
              Object.entries(result.category_scores).map(([category, score], idx) => (
                <div key={category} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">{category.replace(/_/g, ' ')}</h3>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Điểm số:</span>
                    <span className="font-medium text-primary">{score}/5</span>
                  </div>
                  <Progress value={typeof score === 'number' ? (score / 5) * 100 : 0} className="h-1.5" />
                </div>
              ))
            ) : (
              <div>Không có dữ liệu nhóm.</div>
                  )}
                </div>
              </div>

              {/* Phân tích */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Phân tích</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{result.analysis || 'Chưa có phân tích.'}</p>
          </div>
                </div>

              {/* Khuyến nghị */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Khuyến nghị</h2>
          <ul className="space-y-3">
            {Array.isArray(result.recommendations) && result.recommendations.length > 0 ? (
              result.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))
            ) : (
              <li>Không có đề xuất</li>
            )}
                </ul>
                </div>
              </div>
    </div>
  );
} 