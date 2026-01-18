import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { authApi } from '../services/api';

interface AuthContextType extends AuthState {
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
  });

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authApi.getMe();
        setState({
          user: response.data,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem('token');
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    checkAuth();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
