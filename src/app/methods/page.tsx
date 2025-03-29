'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { TradeMethod } from '@/types/method';
import { 
  Plus, Search, Filter, ChevronRight, BarChart2, PenLine, Trash2, 
  Clock, Lightbulb, Target, Wand2, RefreshCw, AlertCircle, Loader2, 
  ListFilter, LayoutGrid, Tag
} from 'lucide-react';
import { methodService } from '@/services/client/method.service';
import { supabase } from '@/lib/supabase/config';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { Method } from '@/models/method.model';

export default function MethodsPage() {
  const router = useRouter();
  const [methods, setMethods] = useState<Method[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newMethod, setNewMethod] = useState({
    name: '',
    description: '',
    rules: [''],
    indicators: [''],
    timeframes: ['']
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

  // Fetch methods
  useEffect(() => {
    async function fetchMethods() {
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 Đang tải danh sách phương pháp...');
        
        // Gọi service để lấy dữ liệu
        const data = await methodService.getAllMethods();
        
        // Chuyển đổi dữ liệu
        const processedData = data.map(method => ({
          ...method,
          description: method.description || '',
          rules: method.rules || [],
          indicators: method.indicators || [],
          timeframes: method.timeframes || []
        }));
        
        console.log(`✅ Đã tải ${processedData.length} phương pháp`);
        setMethods(processedData);
      } catch (err) {
        console.error('💥 Lỗi khi tải phương pháp:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMethods();
  }, []);

  // Filtered and sorted methods
  const filteredAndSortedMethods = methods
    .filter(method => 
      method.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      method.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      } else if (sortOption === 'oldest') {
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewMethod({
      ...newMethod,
      [e.target.name]: e.target.value
    });
  };

  const handleRuleChange = (index: number, value: string) => {
    const updatedRules = [...newMethod.rules];
    updatedRules[index] = value;
    setNewMethod({
      ...newMethod,
      rules: updatedRules
    });
  };

  const addRule = () => {
    setNewMethod({
      ...newMethod,
      rules: [...newMethod.rules, '']
    });
  };

  const removeRule = (index: number) => {
    const updatedRules = [...newMethod.rules];
    updatedRules.splice(index, 1);
    setNewMethod({
      ...newMethod,
      rules: updatedRules
    });
  };

  const handleIndicatorChange = (index: number, value: string) => {
    const updatedIndicators = [...newMethod.indicators];
    updatedIndicators[index] = value;
    setNewMethod({
      ...newMethod,
      indicators: updatedIndicators
    });
  };

  const addIndicator = () => {
    setNewMethod({
      ...newMethod,
      indicators: [...newMethod.indicators, '']
    });
  };

  const removeIndicator = (index: number) => {
    const updatedIndicators = [...newMethod.indicators];
    updatedIndicators.splice(index, 1);
    setNewMethod({
      ...newMethod,
      indicators: updatedIndicators
    });
  };

  const handleTimeframeChange = (index: number, value: string) => {
    const updatedTimeframes = [...newMethod.timeframes];
    updatedTimeframes[index] = value;
    setNewMethod({
      ...newMethod,
      timeframes: updatedTimeframes
    });
  };

  const addTimeframe = () => {
    setNewMethod({
      ...newMethod,
      timeframes: [...newMethod.timeframes, '']
    });
  };

  const removeTimeframe = (index: number) => {
    const updatedTimeframes = [...newMethod.timeframes];
    updatedTimeframes.splice(index, 1);
    setNewMethod({
      ...newMethod,
      timeframes: updatedTimeframes
    });
  };

  const validateForm = () => {
    if (!newMethod.name) return false;
    if (newMethod.rules.some(rule => !rule)) return false;
    if (newMethod.indicators.some(indicator => !indicator)) return false;
    if (newMethod.timeframes.some(timeframe => !timeframe)) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMethod.name,
          description: newMethod.description,
          rules: newMethod.rules.filter(rule => rule.trim() !== ''),
          indicators: newMethod.indicators.filter(indicator => indicator.trim() !== ''),
          timeframes: newMethod.timeframes.filter(timeframe => timeframe.trim() !== '')
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create method');
      }
      
      const data = await response.json();
      
      // Thêm phương pháp mới vào state
      setMethods([data, ...methods]);
      
      // Reset form và đóng dialog
      setNewMethod({
        name: '',
        description: '',
        rules: [''],
        indicators: [''],
        timeframes: ['']
      });
      setIsCreateDialogOpen(false);
      
      // Chuyển hướng đến trang chi tiết phương pháp
      router.push(`/methods/${data.id}`);
      
    } catch (err) {
      console.error('Error creating method:', err);
      setError('Không thể tạo phương pháp mới. Vui lòng thử lại sau.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="mt-4 text-gray-600">Đang tải phương pháp giao dịch...</p>
      </div>
    );
  }

  // Error state
  if (error && methods.length === 0) {
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
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Target className="h-6 w-6 mr-2 text-primary" />
                Phương pháp giao dịch
              </h1>
              <p className="text-gray-600 mt-1">Quản lý các phương pháp giao dịch của bạn</p>
            </div>
            <Link 
              href="/methods/new" 
              className="mt-4 md:mt-0 bg-gradient-to-r from-primary to-primary/80"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm phương pháp
            </Link>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm phương pháp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="alphabetical">A-Z</option>
              </select>
              <Button
                variant="outline"
                className={viewMode === 'grid' ? 'bg-gray-100' : ''}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className={viewMode === 'list' ? 'bg-gray-100' : ''}
                onClick={() => setViewMode('list')}
              >
                <ListFilter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {methods.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-dashed border-2">
              <CardContent className="py-12 text-center">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Bạn chưa có phương pháp giao dịch nào</p>
                <p className="text-gray-400 max-w-md mx-auto mb-6 text-sm">
                  Tạo phương pháp giao dịch để thiết lập quy tắc, theo dõi hiệu suất và cải thiện kết quả giao dịch của bạn
                </p>
                <Link 
                  href="/methods/new" 
                  className="bg-gradient-to-r from-primary to-primary/80"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo phương pháp đầu tiên
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filtered empty state */}
        {methods.length > 0 && filteredAndSortedMethods.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Không tìm thấy phương pháp nào phù hợp với "{searchTerm}"</p>
            <Button 
              variant="link" 
              onClick={() => setSearchTerm('')}
              className="mt-2"
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}

        {/* Methods list */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card 
                  className="h-full cursor-pointer hover:shadow-md transition-all overflow-hidden flex flex-col border-l-4"
                  style={{ borderLeftColor: '#6366f1' }}
                  onClick={() => router.push(`/methods/${method.id}`)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-start">
                      <span className="text-lg font-semibold line-clamp-1">{method.name}</span>
                    </CardTitle>
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(method.created_at || '').toLocaleDateString('vi-VN')}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-grow pb-2">
                    {method.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{method.description}</p>
                    )}
                    
                    <div className="space-y-3">
                      {method.rules && method.rules.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                            <ListFilter className="h-3 w-3 mr-1" />
                            Quy tắc
                          </p>
                          <ul className="text-sm space-y-1 pl-2">
                            {method.rules.slice(0, 2).map((rule: string, idx: number) => (
                              <li key={idx} className="line-clamp-1 flex">
                                <span className="text-primary mr-1">•</span>
                                <span>{rule}</span>
                              </li>
                            ))}
                            {method.rules.length > 2 && (
                              <li className="text-gray-500 text-xs">+ {method.rules.length - 2} quy tắc khác</li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      {method.indicators && method.indicators.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                            <BarChart2 className="h-3 w-3 mr-1" />
                            Chỉ báo
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {method.indicators.slice(0, 3).map((indicator: string, idx: number) => (
                              <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                {indicator}
                              </span>
                            ))}
                            {method.indicators.length > 3 && (
                              <span className="text-gray-500 text-xs flex items-center">
                                +{method.indicators.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3 pb-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto text-xs text-primary hover:text-primary-dark flex items-center"
                    >
                      Chi tiết
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-sm transition-all border-l-4"
                  style={{ borderLeftColor: '#6366f1' }}
                  onClick={() => router.push(`/methods/${method.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="md:flex-grow">
                        <div className="flex items-center mb-2">
                          <h3 className="font-semibold text-lg">{method.name}</h3>
                          <span className="text-xs text-gray-500 ml-3 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(method.created_at || '').toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        
                        {method.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-1">{method.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-3 mt-2">
                          {method.indicators && method.indicators.length > 0 && (
                            <div className="flex items-center">
                              <BarChart2 className="h-3 w-3 text-blue-500 mr-1" />
                              <div className="flex flex-wrap gap-1">
                                {method.indicators.slice(0, 3).map((indicator: string, idx: number) => (
                                  <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                                    {indicator}
                                  </span>
                                ))}
                                {method.indicators.length > 3 && (
                                  <span className="text-gray-500 text-xs">+{method.indicators.length - 3}</span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {method.timeframes && method.timeframes.length > 0 && (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 text-green-500 mr-1" />
                              <div className="flex flex-wrap gap-1">
                                {method.timeframes.slice(0, 3).map((timeframe: string, idx: number) => (
                                  <span key={idx} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                                    {timeframe}
                                  </span>
                                ))}
                                {method.timeframes.length > 3 && (
                                  <span className="text-gray-500 text-xs">+{method.timeframes.length - 3}</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-3 md:mt-0">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary-dark flex items-center"
                        >
                          Chi tiết
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Create Method Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Tạo phương pháp giao dịch mới
            </DialogTitle>
            <DialogDescription>
              Thiết lập chi tiết về phương pháp giao dịch của bạn
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-right">Tên phương pháp</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nhập tên phương pháp"
                  value={newMethod.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-right">Mô tả</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Mô tả về phương pháp giao dịch của bạn"
                  value={newMethod.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-right mb-2 block">Quy tắc giao dịch</Label>
                <div className="space-y-2">
                  {newMethod.rules.map((rule, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Quy tắc ${index + 1}`}
                        value={rule}
                        onChange={(e) => handleRuleChange(index, e.target.value)}
                        required
                      />
                      {newMethod.rules.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeRule(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addRule}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm quy tắc
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-right mb-2 block">Chỉ báo sử dụng</Label>
                <div className="space-y-2">
                  {newMethod.indicators.map((indicator, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Chỉ báo ${index + 1}`}
                        value={indicator}
                        onChange={(e) => handleIndicatorChange(index, e.target.value)}
                        required
                      />
                      {newMethod.indicators.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeIndicator(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addIndicator}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm chỉ báo
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-right mb-2 block">Khung thời gian</Label>
                <div className="space-y-2">
                  {newMethod.timeframes.map((timeframe, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Khung thời gian ${index + 1}`}
                        value={timeframe}
                        onChange={(e) => handleTimeframeChange(index, e.target.value)}
                        required
                      />
                      {newMethod.timeframes.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeTimeframe(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTimeframe}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm khung thời gian
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button 
                type="submit"
                disabled={!validateForm()}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                Tạo phương pháp
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 