'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ITrade } from '@/interfaces/trade.interface';
import { IMethod } from '@/interfaces/method.interface';
import { Button } from '@/components/ui/button';

export default function NewTradePage() {
  const router = useRouter();
  const [methods, setMethods] = useState<IMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [trade, setTrade] = useState<Partial<ITrade>>({
    trade_method_id: null,
    symbol: '',
    type: 'long',
    entry_price: 0,
    quantity: 0,
    note: null,
    status: 'open',
    entry_date: new Date().toISOString(),
    exit_price: null,
    exit_date: null,
    images: [],
    profit: null,
    real_backtest: 'real'
  });

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/methods');
        if (!response.ok) {
          throw new Error('Failed to fetch methods');
        }
        const methodsData = await response.json();
        setMethods(methodsData);
      } catch (error) {
        console.error('Error fetching methods:', error);
        setError('Có lỗi xảy ra khi tải danh sách phương pháp');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMethods();
  }, []);

  const validateTrade = (trade: Partial<ITrade>): string | null => {
    if (!trade.symbol?.trim()) return 'Vui lòng nhập cặp tiền';
    if (!trade.type || !['long', 'short'].includes(trade.type)) return 'Loại lệnh không hợp lệ';
    if (!trade.entry_price || trade.entry_price <= 0) return 'Giá vào phải lớn hơn 0';
    if (!trade.quantity || trade.quantity <= 0) return 'Số lượng phải lớn hơn 0';
    if (!trade.entry_date) return 'Vui lòng chọn ngày vào lệnh';
    if (!trade.status || !['open', 'closed'].includes(trade.status)) return 'Trạng thái không hợp lệ';
    if (!trade.real_backtest || !['real', 'backtest'].includes(trade.real_backtest)) return 'Loại giao dịch không hợp lệ';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validationError = validateTrade(trade);
      if (validationError) {
        setError(validationError);
        return;
      }

      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...trade,
          created_at: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create trade');
      }

      router.push('/trades');
    } catch (error) {
      console.error('Error creating trade:', error);
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo giao dịch mới');
    }
  };

  const handleJsonPaste = () => {
    try {
      const data = JSON.parse(jsonInput);
      setTrade({
        trade_method_id: data.method_id || '',
        symbol: data.pair || '',
        type: data.type?.toLowerCase() === 'buy' ? 'long' : (data.type?.toLowerCase() === 'sell' ? 'short' : 'long'),
        entry_price: data.entry_price || 0,
        exit_price: data.exit_price || null,
        quantity: data.quantity || 0,
        note: data.note || '',
        status: data.exit_price ? 'closed' : 'open',
        entry_date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        exit_date: data.exit_price ? new Date().toISOString() : null,
        images: data.screenshot ? [data.screenshot] : [],
        profit: data.profit || null,
        real_backtest: 'real',
      });
      setError(null);
    } catch (e) {
      setError('JSON không hợp lệ!');
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
        <div className="mt-4">
          <textarea
            className="w-full border rounded p-2"
            rows={6}
            placeholder="Dán JSON giao dịch vào đây..."
            value={jsonInput}
            onChange={e => setJsonInput(e.target.value)}
          />
          <Button className="mt-2" onClick={handleJsonPaste} type="button">Tự động điền</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thêm Giao Dịch Mới</h1>
      <div className="mb-6">
        <textarea
          className="w-full border rounded p-2"
          rows={6}
          placeholder="Dán JSON giao dịch vào đây..."
          value={jsonInput}
          onChange={e => setJsonInput(e.target.value)}
        />
        <Button className="mt-2" onClick={handleJsonPaste} type="button">Tự động điền</Button>
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white shadow-md rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Loại Giao Dịch</label>
            <select
              value={trade.real_backtest}
              onChange={(e) => setTrade({ ...trade, real_backtest: e.target.value as 'real' | 'backtest' })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="real">Giao dịch thật</option>
              <option value="backtest">Backtest</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phương Pháp</label>
            <select
              value={trade.trade_method_id || ''}
              onChange={(e) => setTrade({ ...trade, trade_method_id: e.target.value || null })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            >
              <option value="">Chọn phương pháp</option>
              {methods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cặp Tiền</label>
            <input
              type="text"
              value={trade.symbol}
              onChange={(e) => setTrade({ ...trade, symbol: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              placeholder="Ví dụ: BTC/USDT"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Loại Lệnh</label>
            <select
              value={trade.type}
              onChange={(e) => setTrade({ ...trade, type: e.target.value as 'long' | 'short' })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Giá Vào</label>
            <input
              type="number"
              step="0.00001"
              min="0"
              value={trade.entry_price}
              onChange={(e) => setTrade({ ...trade, entry_price: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Số Lượng</label>
            <input
              type="number"
              step="0.00001"
              min="0"
              value={trade.quantity}
              onChange={(e) => setTrade({ ...trade, quantity: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày Vào Lệnh</label>
            <input
              type="datetime-local"
              value={trade.entry_date?.slice(0, 16)}
              onChange={(e) => setTrade({ ...trade, entry_date: new Date(e.target.value).toISOString() })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hình Ảnh URL (Phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              value={trade.images ? trade.images.join(',') : ''}
              onChange={(e) => setTrade({ ...trade, images: e.target.value ? e.target.value.split(',') : [] })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              placeholder="URL1,URL2,URL3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ghi Chú</label>
            <textarea
              value={trade.note || ''}
              onChange={(e) => setTrade({ ...trade, note: e.target.value || null })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/trades')}
          >
            Hủy
          </Button>
          <Button
            type="submit"
          >
            Thêm Giao Dịch
          </Button>
        </div>
      </form>
    </div>
  );
} 