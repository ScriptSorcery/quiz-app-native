import React, { createContext, ReactNode, useContext, useState } from 'react';

type UserRole = 'user' | 'admin' | null;

interface User {
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Dummy authentication logic
    // Check if email contains 'admin' to determine role
    const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'user';
    setUser({ email, role });
  };

  const signup = async (email: string, password: string, role: UserRole) => {
    // Dummy signup logic
    setUser({ email, role: role || 'user' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
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
