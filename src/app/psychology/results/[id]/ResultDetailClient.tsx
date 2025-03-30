'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { PsychologyTestResult } from '@/models/psychology.model';
import { Share2, Download, ChevronRight, Lightbulb, Brain, Award, LineChart, Zap } from 'lucide-react';

interface ResultDetailClientProps {
  result: PsychologyTestResult;
}

export default function ResultDetailClient({ result }: ResultDetailClientProps) {
  const router = useRouter();
  
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

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-4xl mx-auto overflow-hidden bg-white shadow-xl rounded-xl">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Kết quả bài kiểm tra tâm lý</h1>
                <p className="text-gray-600 mt-1">
                  Ngày {new Date(result.taken_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost">
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4 mr-2" />
                  Tải PDF
                </Button>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {/* Điểm tổng quan */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <Award className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-xl font-semibold">Điểm tổng quan</h3>
                </div>
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center relative"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <svg className="w-32 h-32 absolute" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#e6e6e6" 
                        strokeWidth="8"
                      />
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke={result.score >= 80 ? "#22c55e" : 
                                result.score >= 60 ? "#3b82f6" : 
                                result.score >= 40 ? "#eab308" : "#ef4444"} 
                        strokeWidth="8"
                        strokeDasharray={`${result.score * 2.83} 283`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="text-center">
                      <span className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </span>
                    </div>
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-gray-700 mb-4">
                      {result.score >= 80 ? 'Xuất sắc! Tâm lý giao dịch của bạn rất mạnh mẽ.' :
                       result.score >= 60 ? 'Tốt! Bạn đã có nền tảng tâm lý giao dịch tốt.' :
                       result.score >= 40 ? 'Trung bình. Còn nhiều điểm cần cải thiện.' :
                       'Cần cải thiện nhiều ở khía cạnh tâm lý giao dịch.'}
                    </p>
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center mb-1">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        <span>80-100: Xuất sắc</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        <span>60-79: Tốt</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                        <span>40-59: Trung bình</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        <span>0-39: Cần cải thiện</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Điểm chi tiết */}
              <div>
                <div className="flex items-center mb-4">
                  <LineChart className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-xl font-semibold">Điểm chi tiết</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div 
                    className="bg-white p-4 rounded-lg border shadow-sm"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Quản lý rủi ro</p>
                      <p className={`font-bold ${getScoreColor(result.category_scores.risk_management)}`}>
                        {result.category_scores.risk_management}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <motion.div 
                        className={`h-2.5 rounded-full ${getProgressColor(result.category_scores.risk_management)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.category_scores.risk_management}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      ></motion.div>
                    </div>
                    <p className="text-sm text-gray-500">Khả năng xác định và kiểm soát rủi ro</p>
                  </motion.div>

                  <motion.div 
                    className="bg-white p-4 rounded-lg border shadow-sm"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Kiểm soát cảm xúc</p>
                      <p className={`font-bold ${getScoreColor(result.category_scores.emotional_control)}`}>
                        {result.category_scores.emotional_control}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <motion.div 
                        className={`h-2.5 rounded-full ${getProgressColor(result.category_scores.emotional_control)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.category_scores.emotional_control}%` }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                      ></motion.div>
                    </div>
                    <p className="text-sm text-gray-500">Khả năng giữ bình tĩnh trong mọi tình huống</p>
                  </motion.div>

                  <motion.div 
                    className="bg-white p-4 rounded-lg border shadow-sm"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Kỷ luật</p>
                      <p className={`font-bold ${getScoreColor(result.category_scores.discipline)}`}>
                        {result.category_scores.discipline}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <motion.div 
                        className={`h-2.5 rounded-full ${getProgressColor(result.category_scores.discipline)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.category_scores.discipline}%` }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                      ></motion.div>
                    </div>
                    <p className="text-sm text-gray-500">Tuân thủ kế hoạch giao dịch đã đề ra</p>
                  </motion.div>
                  
                  {result.category_scores.trading_preparation && (
                    <motion.div 
                      className="bg-white p-4 rounded-lg border shadow-sm"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">Chuẩn bị giao dịch</p>
                        <p className={`font-bold ${getScoreColor(result.category_scores.trading_preparation)}`}>
                          {result.category_scores.trading_preparation}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <motion.div 
                          className={`h-2.5 rounded-full ${getProgressColor(result.category_scores.trading_preparation)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.category_scores.trading_preparation}%` }}
                          transition={{ delay: 0.8, duration: 0.8 }}
                        ></motion.div>
                      </div>
                      <p className="text-sm text-gray-500">Mức độ chuẩn bị trước khi vào giao dịch</p>
                    </motion.div>
                  )}
                  
                  {result.category_scores.trading_mindset && (
                    <motion.div 
                      className="bg-white p-4 rounded-lg border shadow-sm"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">Tư duy giao dịch</p>
                        <p className={`font-bold ${getScoreColor(result.category_scores.trading_mindset)}`}>
                          {result.category_scores.trading_mindset}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <motion.div 
                          className={`h-2.5 rounded-full ${getProgressColor(result.category_scores.trading_mindset)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.category_scores.trading_mindset}%` }}
                          transition={{ delay: 0.9, duration: 0.8 }}
                        ></motion.div>
                      </div>
                      <p className="text-sm text-gray-500">Tư duy và cách tiếp cận thị trường</p>
                    </motion.div>
                  )}
                  
                  {result.category_scores.self_improvement && (
                    <motion.div 
                      className="bg-white p-4 rounded-lg border shadow-sm"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.0 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">Tự hoàn thiện</p>
                        <p className={`font-bold ${getScoreColor(result.category_scores.self_improvement)}`}>
                          {result.category_scores.self_improvement}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <motion.div 
                          className={`h-2.5 rounded-full ${getProgressColor(result.category_scores.self_improvement)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.category_scores.self_improvement}%` }}
                          transition={{ delay: 1.0, duration: 0.8 }}
                        ></motion.div>
                      </div>
                      <p className="text-sm text-gray-500">Khả năng học hỏi và cải thiện bản thân</p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Phân tích */}
              <motion.div 
                className="bg-white p-6 rounded-xl border shadow-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <div className="flex items-center mb-4">
                  <Brain className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-xl font-semibold">Phân tích</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{result.analysis}</p>
              </motion.div>

              {/* Khuyến nghị */}
              <motion.div 
                className="bg-blue-50 p-6 rounded-xl border border-blue-100"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center mb-4">
                  <Lightbulb className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-blue-800">Khuyến nghị</h3>
                </div>
                <ul className="space-y-4">
                  {result.recommendations.map((recommendation, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{recommendation}</p>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-8 bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center text-blue-800">
                    <Zap className="h-5 w-5 mr-2" />
                    <p className="font-medium">Tiếp theo bạn nên làm gì?</p>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">
                    Hãy áp dụng các khuyến nghị trên vào giao dịch thực tế và làm lại bài kiểm tra sau 30 ngày để theo dõi sự tiến bộ của bạn.
                  </p>
                </div>
              </motion.div>

              {/* Footer buttons */}
              <div className="flex flex-wrap justify-between items-center pt-4 border-t">
                <Button variant="outline" onClick={() => router.push('/psychology/results')}>
                  Xem lịch sử
                </Button>
                <Button onClick={() => router.push('/psychology')} className="ml-auto flex items-center">
                  Làm bài kiểm tra mới
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 