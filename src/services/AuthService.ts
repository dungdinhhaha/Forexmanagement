import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/config';

export class AuthService {
  private static instance: AuthService;
  private supabase: any = null;
  private currentUser: User | null = null;

  private constructor() {
    // Kiểm tra biến môi trường phía client
    if (typeof window !== 'undefined' && 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      this.supabase = createClientComponentClient();
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) return this.currentUser;

    try {
      if (!this.supabase) {
        console.error('Supabase client is not initialized');
        return null;
      }
      
      const { data: { user } } = await this.supabase.auth.getUser();
      this.currentUser = user;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getCurrentUserId(): Promise<string | null> {
    try {
      if (!this.supabase) {
        console.error('Supabase client is not initialized');
        return null;
      }
      
      try {
        const { data: { user } } = await this.supabase.auth.getUser();
        return user?.id || null;
      } catch (authError) {
        console.warn('Error calling getUser, falling back to getSession:', authError);
        // Fallback to session if getUser is not available
        const { data } = await this.supabase.auth.getSession();
        return data.session?.user?.id || null;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async signOut() {
    if (!this.supabase) {
      console.error('Supabase client is not initialized');
      return;
    }
    
    await this.supabase.auth.signOut();
    this.currentUser = null;
  }
}

export const authService = AuthService.getInstance(); 