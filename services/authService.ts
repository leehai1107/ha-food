import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Account,
  ApiResponse,
  RefreshTokenResponse
} from '../types';
import api from './api';


class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', credentials);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', userData);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      // Logout should succeed even if API call fails
      console.error('Logout API call failed:', error);
    }
  }

  async getCurrentUser(): Promise<Account> {
    try {
      const response = await api.get<ApiResponse<Account>>('/api/auth/me');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to get user info';
      throw new Error(message);
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await api.post<ApiResponse<RefreshTokenResponse>>('/api/auth/refresh', {
        refreshToken
      });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Token refresh failed';
      throw new Error(message);
    }
  }

  // Helper method to check if user is admin
  isAdmin(account: Account | null): boolean {
    if (!account || !account.role) return false;
    return ['admin', 'Admin', 'ADMIN'].includes(account.role.name);
  }

  // Helper method to check if user has specific role
  hasRole(account: Account | null, roleName: string): boolean {
    if (!account || !account.role) return false;
    return account.role.name.toLowerCase() === roleName.toLowerCase();
  }

  // Helper method to get user's role name
  getUserRole(account: Account | null): string | null {
    return account?.role?.name || null;
  }
}

const authService = new AuthService();
export default authService;
