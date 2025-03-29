'use client';

import { useState, useEffect } from 'react';
import { IMethod } from '@/interfaces/method.interface';
import { ITrade } from '@/interfaces/trade.interface';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AnalysisPage() {
  const supabase = createClientComponentClient();
  const [methods, setMethods] = useState<IMethod[]>([]);
  const [trades, setTrades] = useState<ITrade[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [methodsRes, tradesRes] = await Promise.all([
          fetch('/api/methods'),
          fetch('/api/trades')
        ]);

        if (!methodsRes.ok) {
          throw new Error('Failed to fetch methods');
        }
        if (!tradesRes.ok) {
          throw new Error('Failed to fetch trades');
        }

        const methodsData = await methodsRes.json();
        const tradesData = await tradesRes.json();
        
        setMethods(methodsData);
        setTrades(tradesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTrades = selectedMethod
    ? trades.filter(trade => trade.trade_method_id === selectedMethod)
    : trades;

  const calculateStats = () => {
    if (!filteredTrades.length) return null;

    const totalTrades = filteredTrades.length;
    const winningTrades = filteredTrades.filter(trade => trade.profit && trade.profit > 0).length;
    const totalProfit = filteredTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    const winRate = (winningTrades / totalTrades) * 100;
    const avgProfit = totalProfit / totalTrades;

    return {
      totalTrades,
      winRate,
      totalProfit,
      avgProfit
    };
  };

  const stats = calculateStats();

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Phân Tích Hiệu Suất</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Chọn Phương Pháp</h2>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Tất cả phương pháp</option>
            {methods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>

        {stats && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Thống Kê</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Tổng giao dịch:</span>{' '}
                <span className="text-gray-600">{stats.totalTrades}</span>
              </div>
              <div>
                <span className="font-medium">Tỷ lệ thắng:</span>{' '}
                <span className="text-gray-600">{stats.winRate.toFixed(2)}%</span>
              </div>
              <div>
                <span className="font-medium">Tổng lợi nhuận:</span>{' '}
                <span className={`text-gray-600 ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${stats.totalProfit.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="font-medium">Lợi nhuận trung bình:</span>{' '}
                <span className={`text-gray-600 ${stats.avgProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${stats.avgProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Danh Sách Giao Dịch</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cặp Tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá Vào
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá Ra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lợi Nhuận
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrades.map((trade) => (
                <tr key={trade.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.symbol}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      trade.type === 'long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.type === 'long' ? 'Long' : 'Short'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${trade.entry_price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {trade.exit_price ? `$${trade.exit_price}` : '—'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${trade.profit && trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trade.profit ? `$${trade.profit.toFixed(2)}` : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(trade.created_at).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 