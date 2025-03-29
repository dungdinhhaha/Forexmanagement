import { BaseModel } from './base.model';
import { User } from './user.model';

/**
 * Interface đại diện cho một phương pháp giao dịch
 */
export interface Method extends BaseModel {
  id: string;
  userId: string;
  name: string;
  description: string;
  rules: string[];
  indicators: string[];
  timeframes: string[];
  createdAt: Date;
  updatedAt: Date | null;
}

/**
 * Interface để tạo mới một phương pháp giao dịch
 */
export interface CreateMethodDto {
  name: string;
  description: string;
  rules: string[];
  indicators: string[];
  timeframes: string[];
}

/**
 * Interface để cập nhật một phương pháp giao dịch
 */
export interface UpdateMethodDto {
  name?: string;
  description?: string;
  rules?: string[];
  indicators?: string[];
  timeframes?: string[];
}

/**
 * Interface cho phương pháp giao dịch có thêm thông tin người dùng
 */
export interface MethodWithUser extends Method {
  user: User;
}

export interface MethodStats {
  totalTrades: number;
  winningTrades: number;
  winRate: number;
  totalProfit: number;
  averageProfit: number;
}

export interface MethodRepository {
  findAllByUserId(userId: string): Promise<Method[]>;
  findById(id: string): Promise<Method | null>;
  create(method: Omit<Method, 'id' | 'createdAt' | 'updatedAt'>): Promise<Method>;
  update(id: string, method: Partial<Method>): Promise<Method>;
  delete(id: string): Promise<void>;
  getStats(methodId: string, userId: string): Promise<MethodStats>;
} 