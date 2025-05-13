'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IPsychologyTestResult } from '@/interfaces/psychology.interface';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Brain, 
  AlertCircle,
  ChevronRight,
  Calendar,
  LineChart
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { Skeleton } from '@/components/ui/skeleton';

interface ResultsPageClientProps {
  results: IPsychologyTestResult[];
}

export default function ResultsPageClient({ results }: ResultsPageClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [validResults, setValidResults] = useState<IPsychologyTestResult[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'all' | 'month' | 'week'>('all');

  useEffect(() => {
    setIsLoading(true);
    // Validate and process results
    const processedResults = results.map(result => {
      let category_scores = result.category_scores || {};
      // Nếu là mảng object, chuyển về object
      if (Array.isArray(category_scores)) {
        category_scores = Object.fromEntries(
          category_scores.map((item: any) => [item.category, item.score])
        );
      }
      return {
        ...result,
        category_scores,
        score: typeof result.score === 'number' ? result.score : 0,
        analysis: typeof result.analysis === 'string' ? result.analysis : JSON.stringify(result.analysis),
        recommendations: Array.isArray(result.recommendations)
          ? result.recommendations.map(r => typeof r === 'string' ? r : JSON.stringify(r))
          : ['Chưa có đề xuất']
      };
    });
    setValidResults(processedResults);
    setIsLoading(false);
  }, [results]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      risk_management: 'Quản lý rủi ro',
      emotional_control: 'Kiểm soát cảm xúc',
      discipline: 'Kỷ luật',
      trading_preparation: 'Chuẩn bị giao dịch',
      trading_mindset: 'Tư duy giao dịch',
      self_improvement: 'Tự cải thiện'
    };
    return labels[category] || category.replace('_', ' ');
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 4) return { label: 'Tốt', color: 'bg-green-100 text-green-800' };
    if (score >= 3) return { label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Cần cải thiện', color: 'bg-red-100 text-red-800' };
  };

  const renderCategoryScores = (scores: { [key: string]: number }) => {
    if (!scores || typeof scores !== 'object') return null;
    
    return Object.entries(scores).map(([category, score]) => {
      const numericScore = typeof score === 'number' ? score : 0;
      const scoreColor = getScoreColor(numericScore);
      return (
        <motion.div 
          key={category} 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between text-sm">
            <span className="font-medium flex items-center">
              <Brain className="h-4 w-4 mr-2 text-primary" />
              {getCategoryLabel(category)}
            </span>
            <span className={scoreColor}>{numericScore}/5</span>
          </div>
          <Progress 
            value={(numericScore / 5) * 100} 
            className={`h-2 ${scoreColor.replace('text', 'bg')}`}
          />
        </motion.div>
      );
    });
  };

  const filterResultsByTimeRange = (results: IPsychologyTestResult[]) => {
    const now = new Date();
    return results.filter(result => {
      const resultDate = new Date(result.taken_at);
      if (selectedTimeRange === 'week') {
        return now.getTime() - resultDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
      }
      if (selectedTimeRange === 'month') {
        return now.getTime() - resultDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
      }
      return true;
    });
  };

  const filteredResults = filterResultsByTimeRange(validResults);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Brain className="h-8 w-8 mr-3 text-primary" />
              Kết quả test tâm lý
            </h1>
            <p className="text-gray-600 mt-2">
              Theo dõi sự tiến bộ của bạn qua các bài test
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2">
              <Button
                variant={selectedTimeRange === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedTimeRange('all')}
                size="sm"
              >
                Tất cả
              </Button>
              <Button
                variant={selectedTimeRange === 'month' ? 'default' : 'outline'}
                onClick={() => setSelectedTimeRange('month')}
                size="sm"
              >
                Tháng này
              </Button>
              <Button
                variant={selectedTimeRange === 'week' ? 'default' : 'outline'}
                onClick={() => setSelectedTimeRange('week')}
                size="sm"
              >
                Tuần này
              </Button>
            </div>
            <Link href="/psychology/test">
              <Button>
                Làm test mới
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {filteredResults.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <LineChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Bạn chưa có kết quả test nào</p>
                  <Link href="/psychology/test">
                    <Button>Bắt đầu làm test</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-6">
              {filteredResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-primary" />
                            Kết quả test #{result.id.slice(0, 8)}
                          </CardTitle>
                          <CardDescription className="flex items-center mt-2">
                            <Clock className="h-4 w-4 mr-2" />
                            {formatDate(result.taken_at)}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {result.score}/15
                          </div>
                          <Badge variant="secondary" className={getScoreBadge(result.score).color}>
                            {getScoreBadge(result.score).label}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {renderCategoryScores(result.category_scores)}
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                          Phân tích
                        </h3>
                        <p className="text-gray-600">{result.analysis}</p>
                      </div>

                      <div className="mt-4">
                        <h3 className="font-semibold mb-2 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                          Đề xuất
                        </h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {result.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6">
                        <Link href={`/psychology/results/${result.id}`}>
                          <Button variant="outline" className="w-full group">
                            Xem chi tiết
                            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
} 