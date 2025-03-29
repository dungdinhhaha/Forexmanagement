'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Method } from '@/models/method.model';
import { methodService } from '@/services/client/method.service';
import { Loader2, ArrowLeft, Edit, Trash, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { use } from 'react';

export default function MethodDetailPage({ params }: { params: { id: string } }) {
  // Add proper type annotation for the use() hook
  const unwrappedParams = use(params as any) as { id: string };
  const { id } = unwrappedParams;
  
  // Model state
  const [method, setMethod] = useState<Method | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rules: [] as string[],
    indicators: [] as string[],
    timeframes: [] as string[]
  });
  
  const router = useRouter();

  // Controller logic - Tải dữ liệu
  useEffect(() => {
    loadMethodData();
  }, [id]);

  const loadMethodData = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Loading method details...');
      
      // Gọi service để lấy dữ liệu
      const methodData = await methodService.getMethodById(id);
      console.log('✅ Method loaded:', methodData);
      
      setMethod(methodData);
      setFormData({
        name: methodData.name,
        description: methodData.description || '',
        rules: methodData.rules || [],
        indicators: methodData.indicators || [],
        timeframes: methodData.timeframes || []
      });
      
      // Tải thống kê
      const statsData = await methodService.getMethodStats(id);
      setStats(statsData);
    } catch (err) {
      console.error('❌ Error loading method:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu phương pháp');
    } finally {
      setIsLoading(false);
    }
  };

  // Controller methods - Xử lý các hành động của người dùng
  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phương pháp này?')) return;
    
    try {
      console.log('🗑️ Deleting method...');
      await methodService.deleteMethod(id);
      console.log('✅ Method deleted');
      router.push('/methods');
    } catch (err) {
      console.error('❌ Error deleting method:', err);
      setError('Có lỗi xảy ra khi xóa phương pháp');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('💾 Updating method...');
      const updatedMethod = await methodService.updateMethod(id, formData);
      console.log('✅ Method updated');
      setMethod(updatedMethod);
      setIsEditing(false);
      loadMethodData(); // Tải lại dữ liệu
    } catch (err) {
      console.error('❌ Error updating method:', err);
      setError('Có lỗi xảy ra khi cập nhật phương pháp');
    }
  };

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
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <Button className="mt-4" variant="outline" onClick={() => router.push('/methods')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  if (!method) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span>Không tìm thấy phương pháp</span>
        </div>
        <Button className="mt-4" variant="outline" onClick={() => router.push('/methods')}>
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
        <Link href="/methods" className="text-gray-600 hover:text-gray-900 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Quay lại danh sách
        </Link>
        <div className="flex space-x-2">
          <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center">
            <Edit className="h-4 w-4 mr-1" />
            Chỉnh sửa
          </Button>
          <Button onClick={handleDelete} variant="destructive" className="flex items-center">
            <Trash className="h-4 w-4 mr-1" />
            Xóa
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">{method.name}</h1>
        
        <div className="text-sm text-gray-500 mb-4 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Tạo lúc: {formatDate(method.created_at)}
        </div>
        
        {method.description && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Mô tả</h2>
            <p className="text-gray-700">{method.description}</p>
          </div>
        )}
        
        {method.rules && method.rules.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Quy tắc</h2>
            <ul className="list-disc pl-5 space-y-1">
              {method.rules.map((rule: string, idx: number) => (
                <li key={idx} className="text-gray-700">{rule}</li>
              ))}
            </ul>
          </div>
        )}
        
        {method.indicators && method.indicators.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Chỉ báo</h2>
            <div className="flex flex-wrap gap-2">
              {method.indicators.map((indicator: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  {indicator}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {method.timeframes && method.timeframes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Khung thời gian</h2>
            <div className="flex flex-wrap gap-2">
              {method.timeframes.map((timeframe: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  {timeframe}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Stats */}
        {stats && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Thống kê hiệu suất</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded shadow-sm border">
                <p className="text-sm text-gray-500">Tổng giao dịch</p>
                <p className="text-xl font-semibold">{stats.totalTrades || 0}</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm border">
                <p className="text-sm text-gray-500">Tỷ lệ thắng</p>
                <p className="text-xl font-semibold">{stats.winRate || 0}%</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm border">
                <p className="text-sm text-gray-500">Lợi nhuận</p>
                <p className="text-xl font-semibold">{stats.profit || 0}%</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm border">
                <p className="text-sm text-gray-500">Drawdown</p>
                <p className="text-xl font-semibold">{stats.maxDrawdown || 0}%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit form - conditionally rendered */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa phương pháp</h2>
            <form onSubmit={handleUpdate}>
              {/* Form fields */}
              {/* ... */}
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 