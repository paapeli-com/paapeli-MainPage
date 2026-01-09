import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: (redirectToLogin?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await apiRequest('/api/v1/users/me', {}, false);
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
      });
    } catch (error) {
      // Token might be invalid, clear it
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Get JWT token from APISIX on panel domain
      const tokenUrl = window.location.hostname.includes('panel.paapeli') 
        ? '/auth/token'
        : 'http://panel.paapeli.local/auth/token';
        
      console.log('Attempting login to:', tokenUrl);
      
      const response = await fetch(tokenUrl, {
        method: 'GET',  // Changed to GET since APISIX basic-auth uses GET
        headers: {
          'Authorization': 'Basic ' + btoa(email + ':' + password),
        },
      });

      console.log('Token response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token request failed:', errorText);
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      console.log('Token received successfully');
      const token = data.access_token;

      if (!token) {
        throw new Error('No access token in response');
      }

      // Store token
      localStorage.setItem('auth_token', token);

      // Get user info
      console.log('Fetching user info...');
      const userData = await apiRequest('/api/v1/users/me', {}, false);
      console.log('User data received:', userData);
      
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
      });
    } catch (error) {
      console.error('Login error:', error);
      // Clear any partial auth state
      localStorage.removeItem('auth_token');
      throw error instanceof Error ? error : new Error('Login failed');
    }
  };

  const signOut = async (redirectToLogin: boolean = true) => {
    localStorage.removeItem('auth_token');
    setUser(null);
    if (redirectToLogin) {
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};  
