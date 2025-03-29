import { BaseModel } from './base.model';

export interface User extends BaseModel {
  email: string;
  profile?: {
    full_name?: string;
    avatar_url?: string;
  };
  settings?: Record<string, any>;
}

export interface UserRepository {
  getCurrentUser(): Promise<User | null>;
  updateProfile(userId: string, profile: Partial<User['profile']>): Promise<User>;
  updateSettings(userId: string, settings: Record<string, any>): Promise<User>;
} 