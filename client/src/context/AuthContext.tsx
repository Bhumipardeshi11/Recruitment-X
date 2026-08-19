import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { AuthService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string, role: 'CANDIDATE' | 'RECRUITER') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('rx_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('rx_token');
      if (storedToken) {
        try {
          const res = await AuthService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            setToken(storedToken);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await AuthService.login(email, password);
      if (res.success && res.data) {
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('rx_token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: res.error || 'Login failed. Please check credentials.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during authentication.' };
    }
  };

  const register = async (email: string, password: string, fullName: string, role: 'CANDIDATE' | 'RECRUITER') => {
    try {
      const res = await AuthService.register(email, password, fullName, role);
      if (res.success && res.data) {
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('rx_token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: res.error || 'Registration failed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during registration.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('rx_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
