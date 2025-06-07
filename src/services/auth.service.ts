import { AuthChangeEvent, Session, SupabaseClient } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export class AuthService {
  private supabaseClient: SupabaseClient;
  private static instance: AuthService | null = null;

  constructor(supabaseClient: SupabaseClient) {
    this.supabaseClient = supabaseClient;
  }

  public static getInstance(supabaseClient: SupabaseClient): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService(supabaseClient);
    }
    return AuthService.instance;
  }

  async getSession(): Promise<Session | null> {
    const { data, error } = await this.supabaseClient.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return data.session;
  }

  async getUser(): Promise<User | null> {
    const session = await this.getSession();
    if (!session) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email || 'admin@example.com',
      role: session.user.app_metadata.role || 'volunteer',
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at,
    };
  }

  async onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabaseClient.auth.onAuthStateChange(callback);
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data.session;
    } catch (error: any) {
      console.error('Sign-in error:', error.message);
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabaseClient.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Sign-out error:', error.message);
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  async register(email: string, password: string, userRole: 'admin' | 'volunteer' | 'leader' | 'stakeholder' = 'volunteer') {
    try {
      // Validate password strength using the database function
      const { data: isValidPassword, error: validationError } = await this.supabaseClient.rpc('validate_password', { password });
      
      if (validationError) {
        console.error('Password validation error:', validationError);
      }
      
      if (!isValidPassword) {
        throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters');
      }

      const { data, error } = await this.supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: userRole,
          },
        },
      });

      if (error) {
        throw error;
      }

      return data.session;
    } catch (error: any) {
      console.error('Registration error:', error.message);
      throw new Error(error.message || 'Failed to register');
    }
  }

  async resetPassword(email: string) {
    try {
      const { data, error } = await this.supabaseClient.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/update-password`,
        }
      );

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Password reset error:', error.message);
      throw new Error(error.message || 'Failed to reset password');
    }
  }

  async updatePassword(newPassword: string) {
    try {
      // Validate password strength using the database function
      const { data: isValidPassword, error: validationError } = await this.supabaseClient.rpc('validate_password', { password: newPassword });
      
      if (validationError) {
        console.error('Password validation error:', validationError);
      }
      
      if (!isValidPassword) {
        throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters');
      }

      const { data, error } = await this.supabaseClient.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Password update error:', error.message);
      throw new Error(error.message || 'Failed to update password');
    }
  }

  async updateEmail(newEmail: string) {
    try {
      const { data, error } = await this.supabaseClient.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Email update error:', error.message);
      throw new Error(error.message || 'Failed to update email');
    }
  }
}
