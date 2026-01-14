import { api } from '@/config/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export const authService = {
  /**
   * Login user with email and password
   * FastAPI endpoint: POST /api/auth/login
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/api/auth/login', credentials);
  },

  /**
   * Register new user
   * FastAPI endpoint: POST /api/auth/signup
   */
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/api/auth/signup', data);
  },

  /**
   * Logout user
   * FastAPI endpoint: POST /api/auth/logout
   */
  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  /**
   * Get current user profile
   * FastAPI endpoint: GET /api/auth/me
   */
  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    return api.get<AuthResponse['user']>('/api/auth/me');
  },

  /**
   * Refresh access token
   * FastAPI endpoint: POST /api/auth/refresh
   */
  refreshToken: async (): Promise<{ access_token: string }> => {
    return api.post<{ access_token: string }>('/api/auth/refresh');
  },
};

