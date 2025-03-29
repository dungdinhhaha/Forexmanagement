'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ITrade } from '@/interfaces/trade.interface';
import { IMethod } from '@/interfaces/method.interface';
import Link from 'next/link';

export default function TradeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [trade, setTrade] = useState<ITrade | null>(null);
  const [method, setMethod] = useState<IMethod | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Lấy thông tin trade
        const tradeResponse = await fetch(`/api/trades/${params.id}`);
        if (!tradeResponse.ok) {
          throw new Error('Failed to fetch trade');
        }
        const tradeData = await tradeResponse.json();
        
        if (!tradeData) {
          setError('Không tìm thấy giao dịch');
          return;
        }
        setTrade(tradeData);

        // Lấy thông tin method nếu có
        if (tradeData.trade_method_id) {
          const methodResponse = await fetch(`/api/methods/${tradeData.trade_method_id}`);
          if (!methodResponse.ok) {
            throw new Error('Failed to fetch method');
          }
          const methodData = await methodResponse.json();
          setMethod(methodData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Có lỗi xảy ra khi tải thông tin giao dịch');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) return;
    
    try {
      const response = await fetch(`/api/trades/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete trade');
      }

      router.push('/trades');
    } catch (error) {
      console.error('Error deleting trade:', error);
      setError('Có lỗi xảy ra khi xóa giao dịch');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Không tìm thấy giao dịch</span>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Chi Tiết Giao Dịch</h1>
        <div className="flex space-x-2">
          <Link href="/trades" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Quay lại
          </Link>
          {trade.status === 'open' && (
            <Link
              href={`/trades/${trade.id}/close`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Đóng Giao Dịch
            </Link>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Xóa Giao Dịch
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Thông Tin Cơ Bản</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Phương Pháp</p>
                  <p className="font-medium">{method ? method.name : 'Không xác định'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cặp Tiền</p>
                  <p className="font-medium">{trade.symbol}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Loại Giao Dịch</p>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      trade.type === 'long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.type === 'long' ? 'Long' : 'Short'}
                    </span>
                  </td>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng Thái</p>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      trade.status === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {trade.status === 'open' ? 'Mở' : 'Đóng'}
                    </span>
                  </td>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Chi Tiết Giao Dịch</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Giá Vào</p>
                  <p className="font-medium">${trade.entry_price}</p>
                </div>
                {trade.exit_price && (
                  <div>
                    <p className="text-sm text-gray-500">Giá Ra</p>
                    <p className="font-medium">${trade.exit_price}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Số Lượng</p>
                  <p className="font-medium">{trade.quantity}</p>
                </div>
                {trade.profit != null && (
                  <div>
                    <p className="text-sm text-gray-500">Lợi Nhuận</p>
                    <p className={`font-medium ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${trade.profit.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Ghi Chú</h2>
            <p className="bg-gray-50 p-3 rounded">{trade.note || 'Không có ghi chú'}</p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-500">
              <div>
                <p>Ngày tạo: {formatDate(trade.created_at)}</p>
              </div>
              <div>
                <p>Cập nhật lần cuối: {formatDate(trade.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 