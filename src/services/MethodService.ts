import { MethodRepository } from '@/repositories/MethodRepository';
import { IMethod } from '@/interfaces/method.interface';

export class MethodService {
  private repository: MethodRepository;

  constructor() {
    this.repository = new MethodRepository();
  }

  async getAllMethods(userId: string): Promise<IMethod[]> {
    return this.repository.getAll(userId);
  }

  async getMethodById(id: string, userId: string): Promise<IMethod | null> {
    // Lấy dữ liệu thực tế từ repository
    return this.repository.getMethodById(id);
  }

  async createMethod(data: Omit<IMethod, 'id'>): Promise<IMethod> {
    return this.repository.create(data);
  }

  async updateMethod(id: string, data: Partial<IMethod>): Promise<IMethod> {
    return this.repository.updateMethod(id, data);
  }

  async deleteMethod(id: string): Promise<void> {
    return this.repository.deleteMethod(id);
  }

  async authenticate() {
    // Trả về dữ liệu mẫu xác thực
    return { authenticated: true, userId: 'user123', error: null };
  }

  async getMethodStats(id: string, userId: string) {
    // Trả về dữ liệu thống kê mẫu
    return {
      total: 10,
      success: 7,
      fail: 3,
      // Thêm các trường khác nếu cần
    };
  }
} 