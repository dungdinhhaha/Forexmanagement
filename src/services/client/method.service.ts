import { IMethod } from '@/interfaces/method.interface';

export class MethodService {
  private static instance: MethodService;

  private constructor() {}

  static getInstance(): MethodService {
    if (!MethodService.instance) {
      MethodService.instance = new MethodService();
    }
    return MethodService.instance;
  }

  async getAllMethods(): Promise<IMethod[]> {
    try {
      const response = await fetch('/api/methods', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching methods:', error);
      throw error;
    }
  }

  async createMethod(data: Partial<IMethod>): Promise<IMethod> {
    try {
      const response = await fetch('/api/methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create method');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating method:', error);
      throw error;
    }
  }

  async updateMethod(id: string, data: Partial<IMethod>): Promise<IMethod> {
    try {
      const response = await fetch(`/api/methods/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update method');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating method:', error);
      throw error;
    }
  }

  async deleteMethod(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/methods/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete method');
      }
    } catch (error) {
      console.error('Error deleting method:', error);
      throw error;
    }
  }
}

export const methodService = MethodService.getInstance(); 