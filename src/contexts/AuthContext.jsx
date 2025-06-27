import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session error:', error);
        }
        if (session?.user) {
          setUser(formatUser(session.user));
        }
      } catch (error) {
        console.error('Get session error:', error);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session?.user) {
          setUser(formatUser(session.user));
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Format user data consistently
  const formatUser = (supabaseUser) => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.full_name || 
            supabaseUser.user_metadata?.name || 
            supabaseUser.email?.split('@')[0] || 
            'User',
      avatar: supabaseUser.user_metadata?.avatar_url || 
              supabaseUser.user_metadata?.picture ||
              `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
      role: supabaseUser.user_metadata?.role || 'user',
      provider: supabaseUser.app_metadata?.provider || 'email'
    };
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Fallback to demo users if Supabase auth fails
        if (email === 'admin@pharmacy.com' && password === 'admin123') {
          const userData = {
            id: '1',
            email: email,
            name: 'John Doe',
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            provider: 'demo'
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          return userData;
        } else if (email === 'tech@pharmacy.com' && password === 'tech123') {
          const userData = {
            id: '2',
            email: email,
            name: 'Jane Smith',
            role: 'technician',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            provider: 'demo'
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          return userData;
        }
        throw error;
      }

      if (data.user) {
        const formattedUser = formatUser(data.user);
        setUser(formattedUser);
        localStorage.setItem('user', JSON.stringify(formattedUser));
        return formattedUser;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      console.log('Initiating Google OAuth...');
      
      // Get current URL for redirect
      const redirectUrl = `${window.location.origin}/#/dashboard`;
      console.log('Redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      console.log('Google OAuth response:', { data, error });

      if (error) {
        console.error('Google OAuth error:', error);
        throw error;
      }
      
      // The actual user setting will happen in the auth state change listener
      return data;
    } catch (error) {
      console.error('Google login error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signup = async (email, password, userData = {}) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.name || '',
            role: userData.role || 'user'
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        const formattedUser = formatUser(data.user);
        setUser(formattedUser);
        localStorage.setItem('user', JSON.stringify(formattedUser));
        return formattedUser;
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Only call Supabase logout if user is not a demo user
      if (user?.provider !== 'demo') {
        await supabase.auth.signOut();
      }
      
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if Supabase logout fails
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/#/reset-password'
      });
      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    signup,
    logout,
    resetPassword,
    updatePassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};