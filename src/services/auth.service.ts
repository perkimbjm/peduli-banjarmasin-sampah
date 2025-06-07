
import { supabase } from "@/integrations/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const AuthService = {
  async signUp(data: SignUpData) {
    try {
      // Validate password using the new validation function
      const { data: isValidPassword } = await supabase.rpc('validate_password', {
        password: data.password
      });

      if (!isValidPassword) {
        throw new Error('Password does not meet security requirements: minimum 8 characters with uppercase, lowercase, and number');
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: data.full_name
          }
        }
      });

      if (error) throw error;

      return { user: authData.user, session: authData.session };
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  },

  async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      return { user: authData.user, session: authData.session };
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  },

  async resetPassword(email: string) {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) throw error;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },

  async updatePassword(newPassword: string) {
    try {
      // Validate password using the new validation function
      const { data: isValidPassword } = await supabase.rpc('validate_password', {
        password: newPassword
      });

      if (!isValidPassword) {
        throw new Error('Password does not meet security requirements: minimum 8 characters with uppercase, lowercase, and number');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
    } catch (error) {
      console.error("Update password error:", error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get user profile and role
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email || '',
        full_name: profile?.full_name || undefined,
        role: userRole?.role || undefined
      };
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }
};
