"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Account, AuthResponse, LoginRequest, RegisterRequest } from '../types';
import authService from '../services/authService';

interface AuthContextType {
  account: Account | null;
  isAuthenticated: boolean;
  role?: string;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!account;

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Verify token and get user info
          const accountData = await authService.getCurrentUser();
          setAccount(accountData);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear invalid token
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authService.login(credentials);

      // Store tokens
      localStorage.setItem('authToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Set user data
      setAccount(response.account);
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authService.register(userData);

      // Store tokens
      localStorage.setItem('authToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Set user data
      setAccount(response.account);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Call logout endpoint first (while token is still valid)
    authService.logout().catch(console.error);

    // Clear tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');

    // Clear user data
    setAccount(null);
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(refreshTokenValue);
      localStorage.setItem('authToken', response.accessToken);
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout(); // Force logout if refresh fails
      throw error;
    }
  };

  const value: AuthContextType = {
    account,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
