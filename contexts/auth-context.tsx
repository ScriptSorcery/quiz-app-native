import { apiClient } from '@/config/api';
import { authService } from '@/services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type UserRole = 'user' | 'admin' | null;

interface User {
  id?: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Set to true for dummy mode (no backend), false for real API mode
const DUMMY_MODE = true;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    if (DUMMY_MODE) {
      setIsLoading(false);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // Set token in axios headers
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get current user
        const userData = await authService.getCurrentUser();
        setUser({
          id: userData.id,
          email: userData.email,
          role: userData.role,
        });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      await AsyncStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    if (DUMMY_MODE) {
      // Dummy authentication logic
      const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'user';
      setUser({ email, role });
      return;
    }

    try {
      const response = await authService.login({ email, password });
      
      // Save token
      await AsyncStorage.setItem('authToken', response.access_token);
      
      // Set token in axios headers
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.access_token}`;
      
      // Set user
      setUser({
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const signup = async (email: string, password: string, role: UserRole) => {
    if (DUMMY_MODE) {
      // Dummy signup logic
      setUser({ email, role: role || 'user' });
      return;
    }

    try {
      const response = await authService.signup({
        email,
        password,
        role: role || 'user',
      });
      
      // Save token
      await AsyncStorage.setItem('authToken', response.access_token);
      
      // Set token in axios headers
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.access_token}`;
      
      // Set user
      setUser({
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Signup failed';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    if (!DUMMY_MODE) {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Logout error:', error);
      }
      
      // Clear token
      await AsyncStorage.removeItem('authToken');
      delete apiClient.defaults.headers.common['Authorization'];
    }
    
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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
