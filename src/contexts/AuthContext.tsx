import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔐 AuthProvider - Getting initial session...');
        
        // Get the current session instead of user directly
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          // Handle specific auth errors gracefully
          if (error.message.includes('AuthSessionMissingError')) {
            console.log('🔐 AuthProvider - No session found (user not logged in)');
          } else {
            console.warn('⚠️ AuthProvider - Session error:', error);
          }
        } else {
          console.log('🔐 AuthProvider - Initial session:', session ? 'Found' : 'None');
        }
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('❌ AuthProvider - Error getting initial session:', error);
        // Don't throw - this is expected when no session exists
        // Set user to null and continue
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 AuthProvider - Auth state changed:', event, session ? 'Session found' : 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthProvider - Signing in...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      console.log('✅ AuthProvider - Sign in successful');
    } catch (error) {
      console.error('❌ AuthProvider - Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthProvider - Signing up...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) throw error;
      console.log('✅ AuthProvider - Sign up successful');
    } catch (error) {
      console.error('❌ AuthProvider - Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('🔐 AuthProvider - Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('✅ AuthProvider - Sign out successful');
    } catch (error) {
      console.error('❌ AuthProvider - Sign out error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('🔐 AuthProvider - Resetting password...');
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      console.log('✅ AuthProvider - Password reset email sent');
    } catch (error) {
      console.error('❌ AuthProvider - Reset password error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 