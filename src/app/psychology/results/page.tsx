'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { psychologyService } from '@/services/PsychologyService';
import { IPsychologyTestResult } from '@/interfaces/psychology.interface';
import { LineChart, ChevronRight, CircleCheck, Calendar, Lightbulb, Brain, AlertCircle, Loader2 } from 'lucide-react';

export default function TestResults() {
  const router = useRouter();
  const [results, setResults] = useState<IPsychologyTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      // Thêm timestamp để tránh cache
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/psychology/results?t=${timestamp}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      
      const data = await response.json();
      setResults(data);
      setLoading(false);
    } catch (err) {
      setError('Không thể tải danh sách kết quả. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-blue-600';
    if (score >= 40) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="mt-4 text-gray-600">Đang tải kết quả...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Brain className="h-6 w-6 mr-2 text-primary" />
                Lịch sử bài kiểm tra tâm lý
              </h1>
              <p className="text-gray-600 mt-1">Theo dõi sự tiến bộ của bạn qua thời gian</p>
            </div>
            <Button 
              onClick={() => router.push('/psychology/test')} 
              className="mt-4 md:mt-0 bg-gradient-to-r from-primary to-primary/80"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Làm bài kiểm tra mới
            </Button>
          </div>

          {results.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
              <div className="flex">
                <CircleCheck className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-800">
                    <span className="font-medium">Mẹo:</span> So sánh các kết quả để theo dõi sự tiến bộ của bạn. Làm bài kiểm tra định kỳ 1 tháng/lần sẽ giúp bạn cải thiện tâm lý giao dịch hiệu quả hơn.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6">
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-md transition-all border-l-4 overflow-hidden group"
                  style={{ borderLeftColor: 
                    result.score >= 80 ? '#22c55e' : 
                    result.score >= 60 ? '#3b82f6' : 
                    result.score >= 40 ? '#eab308' : '#ef4444' 
                  }}
                  onClick={() => router.push(`/psychology/results/${result.id}`)}
                >
                  <CardHeader className="bg-gray-50 group-hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <CardTitle className="text-lg font-medium">
                          {new Date(result.taken_at).toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </CardTitle>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.score >= 80 ? 'bg-green-100 text-green-800' : 
                        result.score >= 60 ? 'bg-blue-100 text-blue-800' : 
                        result.score >= 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.score}%
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-1 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            Quản lý rủi ro
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${getProgressColor(result.category_scores.risk_management)}`}
                              style={{ width: `${result.category_scores.risk_management}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-right mt-1 text-gray-500">{result.category_scores.risk_management}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1 flex items-center">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                            Kiểm soát cảm xúc
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${getProgressColor(result.category_scores.emotional_control)}`}
                              style={{ width: `${result.category_scores.emotional_control}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-right mt-1 text-gray-500">{result.category_scores.emotional_control}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Kỷ luật
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${getProgressColor(result.category_scores.discipline)}`}
                              style={{ width: `${result.category_scores.discipline}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-right mt-1 text-gray-500">{result.category_scores.discipline}%</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 line-clamp-1 flex-1">
                          {result.analysis.split('.')[0]}.
                        </p>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {results.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-dashed border-2">
                  <CardContent className="py-12 text-center">
                    <LineChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Bạn chưa làm bài kiểm tra nào</p>
                    <p className="text-gray-400 max-w-md mx-auto mb-6 text-sm">
                      Bài kiểm tra tâm lý sẽ giúp bạn đánh giá khả năng kiểm soát cảm xúc, quản lý rủi ro và kỷ luật trong giao dịch
                    </p>
                    <Button 
                      onClick={() => router.push('/psychology/test')}
                      className="bg-gradient-to-r from-primary to-primary/80"
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Làm bài kiểm tra ngay
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 