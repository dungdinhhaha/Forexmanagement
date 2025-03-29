import { getSupabaseClient } from '@/lib/supabase/client';
import { User } from '@/models/user.model';
import { AuthError } from '@supabase/supabase-js';

export class AuthService {
  private static instance: AuthService;
  private supabase = getSupabaseClient();
  
  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error || !data.user) return null;
    
    // Fetch additional profile data if needed
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    return {
      id: data.user.id,
      email: data.user.email!,
      profile: profile || {},
      created_at: data.user.created_at
    };
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return {
      user: data?.user ? { 
        id: data.user.id, 
        email: data.user.email!,
        created_at: data.user.created_at
      } : null,
      error
    };
  }

  async signUp(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    
    return {
      user: data?.user ? { 
        id: data.user.id, 
        email: data.user.email!,
        created_at: data.user.created_at
      } : null,
      error
    };
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }
}

export const authService = AuthService.getInstance(); 