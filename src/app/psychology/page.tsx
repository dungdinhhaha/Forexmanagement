'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { psychologyService } from '@/services/PsychologyService';
import { IPsychologyQuestion, IPsychologyTestResult } from '@/interfaces/psychology.interface';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Psychology() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Kiểm tra tâm lý giao dịch
        </h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Giới thiệu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Bài kiểm tra tâm lý giao dịch sẽ giúp bạn đánh giá 3 khía cạnh quan trọng:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Quản lý rủi ro: Khả năng kiểm soát và quản lý rủi ro trong giao dịch</li>
                <li>Kiểm soát cảm xúc: Khả năng giữ bình tĩnh và không để cảm xúc chi phối</li>
                <li>Kỷ luật: Khả năng tuân thủ kế hoạch và quy tắc giao dịch</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hướng dẫn</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Bài kiểm tra gồm 15 câu hỏi, mỗi câu có 4 lựa chọn</li>
                <li>Hãy chọn câu trả lời phản ánh đúng nhất suy nghĩ và hành vi của bạn</li>
                <li>Không có câu trả lời đúng hay sai, hãy trả lời trung thực</li>
                <li>Bạn có thể quay lại sửa câu trả lời trước khi nộp bài</li>
                <li>Kết quả sẽ được phân tích và đưa ra các khuyến nghị phù hợp</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lịch sử bài kiểm tra</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Xem lại kết quả các bài kiểm tra trước và theo dõi sự tiến bộ của bạn.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push('/psychology/results')}>
                Xem lịch sử
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bắt đầu bài kiểm tra</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sẵn sàng để đánh giá tâm lý giao dịch của bạn?
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push('/psychology/test')}>
                Bắt đầu ngay
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 