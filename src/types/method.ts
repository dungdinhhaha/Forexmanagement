/**
 * Interface định nghĩa cấu trúc của một phương pháp giao dịch
 */
export interface TradeMethod {
  id: string;
  user_id: string;
  name: string;
  description: string;
  rules: string[];
  indicators: string[];
  timeframes: string[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface định nghĩa thống kê hiệu suất của phương pháp
 */
export interface MethodStats {
  totalTrades: number;
  winningTrades: number;
  winRate: number;
  totalProfit: number;
  averageProfit: number;
}

/**
 * Interface định nghĩa tham số để lọc phương pháp
 */
export interface MethodFilterParams {
  searchTerm?: string;
  indicator?: string;
  timeframe?: string;
  sortBy?: 'newest' | 'oldest' | 'alphabetical';
}

/**
 * Interface định nghĩa form tạo/cập nhật phương pháp
 */
export interface MethodFormData {
  name: string;
  description: string;
  rules: string[];
  indicators: string[];
  timeframes: string[];
} 