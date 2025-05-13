import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { psychologyRepository } from '@/repositories/PsychologyRepository';
import { IPsychologyTestResult } from '@/interfaces/psychology.interface';
import { serverAuthService } from './ServerAuthService';

export class PsychologyService {
  private getSupabase() {
    return createServerComponentClient({ cookies });
  }

  async authenticate() {
    try {
      const userId = await serverAuthService.getCurrentUserId();
      console.log('Authentication check - User ID:', userId);
      
      if (!userId) {
        console.log('User not authenticated');
        return { authenticated: false, userId: null };
      }
      
      return { authenticated: true, userId };
    } catch (error) {
      console.error('Authentication error:', error);
      return { authenticated: false, userId: null };
    }
  }

  async getTestResultById(id: string): Promise<IPsychologyTestResult | null> {
    try {
      const { authenticated, userId } = await this.authenticate();
      if (!authenticated || !userId) {
        throw new Error('Not authenticated');
      }
      
      console.log('Getting test result - Current user ID:', userId);
      console.log('Requested test result ID:', id);
      
      const result = await psychologyRepository.getTestResultById(id, userId);
      console.log('Test result retrieved:', result);
      
      if (!result) {
        console.log('No test result found');
        return null;
      }

      return result;
    } catch (error) {
      console.error('Error in getTestResultById service:', error);
      throw error;
    }
  }

  async getTestResults(): Promise<IPsychologyTestResult[]> {
    try {
      const { authenticated, userId } = await this.authenticate();
      if (!authenticated || !userId) {
        throw new Error('Not authenticated');
      }
      
      console.log('Getting test results for user:', userId);
      const results = await psychologyRepository.getTestResults(userId);
      console.log('Found test results:', results);
      
      return results;
    } catch (error) {
      console.error('Error in getTestResults service:', error);
      throw error;
    }
  }

  // Các phương thức sẽ được thêm sau
  async getPsychologyEntries() {
    // Triển khai sau
    return [];
  }
}

export const psychologyService = new PsychologyService(); 