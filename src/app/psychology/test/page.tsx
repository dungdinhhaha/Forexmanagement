'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { psychologyService } from '@/services/client/psychology.service';
import { IPsychologyQuestion } from '@/interfaces/psychology.interface';
import { CheckCircle2, Circle, ArrowLeft, ArrowRight, Brain, AlertCircle, Loader2, Timer } from 'lucide-react';

export default function PsychologyTest() {
  const router = useRouter();
  const [questions, setQuestions] = useState<IPsychologyQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answerIndex: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    loadQuestions();
    setStartTime(new Date());
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await psychologyService.getQuestions();
      setQuestions(data);
      // Khởi tạo mảng answers với số lượng phần tử bằng số câu hỏi
      setAnswers(new Array(data.length).fill(undefined));
      setLoading(false);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Không thể tải câu hỏi. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: questions[currentQuestion].id,
      answerIndex
    };
    setAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Kiểm tra xem tất cả câu hỏi đã được trả lời chưa
    const unansweredQuestions = answers.findIndex(answer => answer === undefined);
    if (unansweredQuestions !== -1) {
      setError(`Vui lòng trả lời tất cả các câu hỏi. (Còn câu ${unansweredQuestions + 1})`);
      setCurrentQuestion(unansweredQuestions);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      console.log('Submitting answers:', answers);
      const result = await psychologyService.submitTest(answers.filter(a => a !== undefined));
      console.log('Test submission result:', result);
      
      if (result && result.id) {
        router.push(`/psychology/results/${result.id}`);
      } else {
        throw new Error('Không nhận được kết quả từ server');
      }
    } catch (err) {
      console.error('Error submitting test:', err);
      setError('Không thể nộp bài kiểm tra. Vui lòng thử lại sau.');
      setSubmitting(false);
    }
  };

  const formatTimeDuration = () => {
    if (!startTime) return '';
    const now = new Date();
    const diffMs = now.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`;
  };

  // Logic hiển thị màu chủ đề dựa vào danh mục câu hỏi hiện tại
  const getCategoryTheme = (category?: string) => {
    if (!category) return 'text-primary';
    
    switch(category) {
      case 'risk_management':
        return 'text-blue-600';
      case 'emotional_control':
        return 'text-purple-600';
      case 'discipline':
        return 'text-green-600';
      case 'trading_preparation':
        return 'text-orange-600';
      case 'trading_mindset':
        return 'text-indigo-600';
      case 'self_improvement':
        return 'text-teal-600';
      default:
        return 'text-primary';
    }
  };

  const getCategoryName = (category?: string) => {
    if (!category) return '';
    
    switch(category) {
      case 'risk_management':
        return 'Quản lý rủi ro';
      case 'emotional_control':
        return 'Kiểm soát cảm xúc';
      case 'discipline':
        return 'Kỷ luật';
      case 'trading_preparation':
        return 'Chuẩn bị giao dịch';
      case 'trading_mindset':
        return 'Tư duy giao dịch';
      case 'self_improvement':
        return 'Tự hoàn thiện';
      default:
        return '';
    }
  };

  const getCompletionStatus = () => {
    const answeredQuestions = answers.filter(a => a !== undefined).length;
    return (answeredQuestions / questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="mt-4 text-gray-600">Đang tải bài kiểm tra...</p>
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

  const currentCategoryTheme = getCategoryTheme(questions[currentQuestion]?.category);
  const currentCategoryName = getCategoryName(questions[currentQuestion]?.category);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Brain className="h-6 w-6 mr-2 text-primary" />
                <h1 className="text-xl font-bold">Bài kiểm tra tâm lý giao dịch</h1>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Timer className="h-4 w-4" />
                <span className="text-sm">{formatTimeDuration()}</span>
              </div>
            </div>
            
            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Tiến độ</span>
                <span className="font-medium">{currentQuestion + 1} / {questions.length}</span>
              </div>
              <Progress value={(currentQuestion + 1) / questions.length * 100} className="h-2" />
            </div>
            
            {/* Category indicator */}
            <div className={`mt-2 text-xs flex items-center ${currentCategoryTheme}`}>
              <span className="w-2 h-2 rounded-full bg-current mr-1"></span>
              <span>Danh mục: {currentCategoryName}</span>
            </div>
            
            {/* Quick jump to questions */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors
                      ${index === currentQuestion 
                        ? 'bg-primary text-white' 
                        : answers[index] !== undefined 
                          ? 'bg-green-100 text-green-700 border border-green-300' 
                          : 'bg-gray-100 text-gray-600'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Question and answers */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <div className="mb-8">
                <h2 className="text-xl font-medium mb-6 leading-relaxed">
                  {questions[currentQuestion]?.question}
                </h2>
                <div className="space-y-3">
                  {questions[currentQuestion]?.answers.map((answer, index) => (
                    <div
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center
                        ${answers[currentQuestion]?.answerIndex === index 
                          ? 'border-2 border-primary bg-primary/5 shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      <div className="mr-3">
                        {answers[currentQuestion]?.answerIndex === index ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className="text-gray-800">{answer.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation buttons */}
              <div className="flex justify-between mt-8 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Trước
                </Button>
                
                {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || answers.some(a => a === undefined)}
                    className={`${getCompletionStatus() === 100 ? 'bg-green-600 hover:bg-green-700' : ''} flex items-center`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang nộp...
                      </>
                    ) : (
                      <>
                        {getCompletionStatus() === 100 ? (
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                        ) : null}
                        Nộp bài
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={goToNextQuestion}
                    disabled={answers[currentQuestion] === undefined}
                    className="flex items-center"
                  >
                    Tiếp theo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Footer */}
          {error && (
            <div className="bg-red-50 border-t border-red-200 p-4">
              <div className="flex items-center text-red-700">
                <AlertCircle className="h-4 w-4 mr-2" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Tiến độ: </span>
                <span>{Math.round(getCompletionStatus())}% hoàn thành</span>
              </div>
              <Button
                variant="link"
                onClick={() => router.push('/psychology')}
                className="text-sm"
              >
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 