'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ITrade } from '@/interfaces/trade.interface';
import { Button } from '@/components/ui/button';

export default function CloseTradePanel() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [trade, setTrade] = useState<ITrade | null>(null);
  const [exitPrice, setExitPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTrade = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/trades/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch trade');
        }
        const tradeData = await response.json();
        if (!tradeData) {
          setError('Không tìm thấy giao dịch');
          return;
        }
        if (tradeData.status === 'closed') {
          setError('Giao dịch này đã được đóng');
          return;
        }
        setTrade(tradeData);
        
        // Đặt giá mặc định là giá hiện tại + 1% cho giao dịch mua, -1% cho giao dịch bán
        if (tradeData.type === 'long') {
          setExitPrice(tradeData.entry_price * 1.01);
        } else {
          setExitPrice(tradeData.entry_price * 0.99);
        }
      } catch (error) {
        console.error('Error fetching trade:', error);
        setError('Có lỗi xảy ra khi tải dữ liệu giao dịch');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTrade();
    }
  }, [id]);

  const calculateProfit = (exitPrice: number): number => {
    if (!trade) return 0;
    const entryTotal = trade.entry_price * trade.quantity;
    const exitTotal = exitPrice * trade.quantity;
    
    // For long positions, profit = exit - entry
    // For short positions, profit = entry - exit
    return trade.type === 'long' 
      ? exitTotal - entryTotal
      : entryTotal - exitTotal;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trade) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/trades/${id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exit_price: exitPrice }),
      });

      if (!response.ok) {
        throw new Error('Failed to close trade');
      }

      router.push(`/trades/${id}`);
    } catch (error) {
      console.error('Error closing trade:', error);
      setError('Có lỗi xảy ra khi đóng giao dịch');
    } finally {
      setIsSubmitting(false);
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

  if (trade.status === 'closed') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Giao dịch này đã được đóng</span>
        </div>
        <div className="mt-4">
          <Button
            onClick={() => router.push('/trades')}
            variant="outline"
          >
            Quay lại Danh sách
          </Button>
        </div>
      </div>
    );
  }

  const profit = calculateProfit(exitPrice);
  const isProfitable = profit > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Đóng Giao Dịch</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin giao dịch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Cặp tiền:</p>
            <p className="font-medium">{trade.symbol}</p>
          </div>
          <div>
            <p className="text-gray-600">Loại giao dịch:</p>
            <p className="font-medium">{trade.type === 'long' ? 'Long' : 'Short'}</p>
          </div>
          <div>
            <p className="text-gray-600">Giá vào:</p>
            <p className="font-medium">${trade.entry_price}</p>
          </div>
          <div>
            <p className="text-gray-600">Số lượng:</p>
            <p className="font-medium">{trade.quantity}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Giá đóng</label>
          <input
            type="number"
            step="0.00001"
            value={exitPrice}
            onChange={(e) => setExitPrice(parseFloat(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-6 p-4 rounded-lg bg-gray-50">
          <p className="text-lg font-medium mb-2">Dự tính kết quả:</p>
          <div className="flex justify-between items-center">
            <p>Lợi nhuận:</p>
            <p className={`text-lg font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              ${profit.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/trades')}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant={isProfitable ? "default" : "destructive"}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đóng giao dịch'}
          </Button>
        </div>
      </form>
    </div>
  );
} 