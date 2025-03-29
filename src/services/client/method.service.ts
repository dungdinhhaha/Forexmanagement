import { Method, CreateMethodDto, UpdateMethodDto, MethodStats } from '@/models/method.model';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export class MethodService {
  private supabase = createClientComponentClient();
  
  // Lấy tất cả phương pháp của người dùng
  async getAllMethods(): Promise<Method[]> {
    try {
      const response = await fetch('/api/methods', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch methods');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching methods:', error);
      throw error;
    }
  }
  
  // Lấy chi tiết phương pháp theo ID
  async getMethodById(id: string): Promise<Method> {
    try {
      const response = await fetch(`/api/methods/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch method');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching method with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Lấy thống kê của phương pháp
  async getMethodStats(id: string): Promise<MethodStats> {
    try {
      const response = await fetch(`/api/methods/${id}/stats`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch method stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching stats for method with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Tạo phương pháp mới
  async createMethod(data: CreateMethodDto): Promise<Method> {
    try {
      const response = await fetch('/api/methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create method');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating method:', error);
      throw error;
    }
  }
  
  // Cập nhật phương pháp
  async updateMethod(id: string, data: UpdateMethodDto): Promise<Method> {
    try {
      const response = await fetch(`/api/methods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update method');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating method with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Xóa phương pháp
  async deleteMethod(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/methods/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete method');
      }
    } catch (error) {
      console.error(`Error deleting method with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Tạo phương pháp từ template
  async createFromTemplate(templateId: string): Promise<Method> {
    try {
      const response = await fetch('/api/methods/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create method from template');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating method from template:', error);
      throw error;
    }
  }
}

// Singleton instance
export const methodService = new MethodService(); 