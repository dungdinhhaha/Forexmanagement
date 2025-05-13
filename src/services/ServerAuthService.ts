import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export class ServerAuthService {
  private static instance: ServerAuthService;

  private constructor() {}

  static getInstance(): ServerAuthService {
    if (!ServerAuthService.instance) {
      ServerAuthService.instance = new ServerAuthService();
    }
    return ServerAuthService.instance;
  }

  async getCurrentUserId(): Promise<string | null> {
    try {
      const supabase = createServerComponentClient({ cookies });
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user:', user);
        return user?.id || null;
      } catch (authError) {
        console.warn('Error calling getUser, falling back to getSession:', authError);
        // Fallback to session if getUser is not available
        const { data } = await supabase.auth.getSession();
        console.log('Session data:', data);
        return data.session?.user?.id || null;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
}

export const serverAuthService = ServerAuthService.getInstance(); 