'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { useAuth } from '@/contexts/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalTrades: number;
  winRate: number;
  totalProfit: number;
  averageProfit: number;
}

interface AccountHistory {
  balance: number;
  created_at: string;
}

export default function DashboardPage() {
  const [supabase, setSupabase] = useState<any>(null);
  const { error: authError } = useAuth();

  useEffect(() => {
    // Kiểm tra biến môi trường phía client
    if (typeof window !== 'undefined' && 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setSupabase(createClientComponentClient());
    }
  }, []);

  const [stats, setStats] = useState<DashboardStats>({
    totalTrades: 0,
    winRate: 0,
    totalProfit: 0,
    averageProfit: 0,
  });
  const [accountHistory, setAccountHistory] = useState<AccountHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accountHistoryError, setAccountHistoryError] = useState<string | null>(null);

  useEffect(() => {
    // Kiểm tra nếu không có biến môi trường Supabase
    if (authError) {
      setError('Không thể tải dữ liệu do thiếu cấu hình Supabase');
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/trades/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        
        setStats({
          totalTrades: data.total_trades || 0,
          winRate: Number((data.win_rate || 0).toFixed(2)),
          totalProfit: Number((data.total_profit || 0).toFixed(2)),
          averageProfit: Number((data.avg_profit || 0).toFixed(2)),
        });
      } catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
        setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAccountHistory = async () => {
      try {
        setAccountHistoryError(null);
        const response = await fetch('/api/accounts/history');
        if (!response.ok) {
          throw new Error('Failed to fetch account history');
        }
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setAccountHistory(data);
        } else {
          setAccountHistoryError('Không có dữ liệu lịch sử tài khoản');
        }
      } catch (error) {
        console.error('Lỗi khi lấy lịch sử tài khoản:', error);
        setAccountHistoryError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải dữ liệu lịch sử tài khoản');
      }
    };

    // Chỉ chạy các API nếu có Supabase
    if (supabase) {
      fetchStats();
      fetchAccountHistory();
    }
  }, [supabase, authError]);

  const chartData = {
    labels: accountHistory.map(item => new Date(item.created_at).toLocaleDateString('vi-VN')),
    datasets: [
      {
        label: 'Số dư tài khoản',
        data: accountHistory.map(item => item.balance),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(53, 162, 235)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        caretSize: 8,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Số dư: $${Number(context.raw).toLocaleString('vi-VN')}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          lineWidth: 1
        },
        ticks: {
          color: '#6b7280',
          padding: 10,
          callback: function(value) {
            return '$' + Number(value).toLocaleString('vi-VN');
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Tổng số trades */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tổng số trades
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stats.totalTrades}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Win rate */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Win rate
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stats.winRate}%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Tổng lợi nhuận */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tổng lợi nhuận
                      </dt>
                      <dd className={`text-lg font-semibold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${stats.totalProfit}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Lợi nhuận trung bình */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Lợi nhuận trung bình
                      </dt>
                      <dd className={`text-lg font-semibold ${stats.averageProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${stats.averageProfit}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account balance chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Biến Động Số Dư Tài Khoản</h2>
            {accountHistoryError ? (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded">
                {accountHistoryError}
              </div>
            ) : accountHistory.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded">
                Chưa có dữ liệu lịch sử tài khoản
              </div>
            ) : (
              <div className="h-[400px] relative">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 