'use client';

import { useEffect, useState } from 'react';
import { TradeService } from '@/services/TradeService';
import { methodService } from '@/services/MethodService';
import { ITrade, ITradeStats } from '@/interfaces/trade.interface';
import { IMethod } from '@/interfaces/method.interface';
import Link from 'next/link';

export default function TradesPage() {
  const [trades, setTrades] = useState<ITrade[]>([]);
  const [methods, setMethods] = useState<IMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ITradeStats | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Lấy danh sách methods
        const methodsResponse = await fetch('/api/methods');
        if (!methodsResponse.ok) throw new Error('Failed to fetch methods');
        const methodsData = await methodsResponse.json();
        setMethods(methodsData);

        // Lấy danh sách trades
        const tradesResponse = await fetch('/api/trades');
        if (!tradesResponse.ok) throw new Error('Failed to fetch trades');
        const tradesData = await tradesResponse.json();
        setTrades(tradesData);

        // Lấy thống kê
        const statsResponse = await fetch('/api/trades/stats');
        if (!statsResponse.ok) throw new Error('Failed to fetch stats');
        const statsData = await statsResponse.json();
        setStats(statsData);

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

  const getMethodName = (methodId: string | null) => {
    if (!methodId) return 'Không xác định';
    const method = methods.find(m => m.id === methodId);
    return method ? method.name : 'Không xác định';
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Danh Sách Giao Dịch</h1>
        <Link href="/trades/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Thêm Giao Dịch
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Tổng Số Giao Dịch</p>
            <p className="text-2xl font-bold">{stats.total_trades}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Tỷ Lệ Thắng</p>
            <p className="text-2xl font-bold">{stats.win_rate.toFixed(1)}%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Tổng Lợi Nhuận</p>
            <p className={`text-2xl font-bold ${stats.total_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${stats.total_profit.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Lợi Nhuận Trung Bình</p>
            <p className={`text-2xl font-bold ${stats.avg_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${stats.avg_profit.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Lọc theo phương pháp:</label>
        <select
          value={selectedMethod || ''}
          onChange={(e) => setSelectedMethod(e.target.value || null)}
          className="w-full md:w-1/3 rounded-md border border-gray-300 p-2"
        >
          <option value="">Tất cả phương pháp</option>
          {methods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phương Pháp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cặp Tiền</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá Vào</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Lượng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lợi Nhuận</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTrades.length > 0 ? (
              filteredTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{getMethodName(trade.trade_method_id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.symbol}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      trade.type === 'long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.type === 'long' ? 'Long' : 'Short'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${trade.entry_price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      trade.status === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {trade.status === 'open' ? 'Mở' : 'Đóng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {trade.profit != null ? (
                      <span className={trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${trade.profit.toFixed(2)}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link href={`/trades/${trade.id}`} className="text-blue-600 hover:text-blue-900">
                      Chi Tiết
                    </Link>
                    {trade.status === 'open' && (
                      <Link href={`/trades/${trade.id}/close`} className="text-green-600 hover:text-green-900">
                        Đóng
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  Không có giao dịch nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 