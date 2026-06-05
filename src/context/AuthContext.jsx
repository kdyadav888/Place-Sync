import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));

        const response = await authAPI.getProfile({ Authorization: `Bearer ${storedToken}` });
        const data = await response.json().catch(() => null);

        if (response.ok && data?.success && data.user) {
          setUser(data.user);
          setToken(storedToken);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // SECURITY: Dev auto-login removed. Use proper login flow in all environments.
  // If you need demo data, implement it via a separate demo mode flag, not hardcoded credentials.

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'user' && event.newValue) {
        try {
          const updatedUser = JSON.parse(event.newValue);
          setUser(updatedUser);
        } catch (e) {
          console.error('Failed to parse user from storage event:', e);
        }
      }
      if (event.key === 'token' && event.newValue) {
        setToken(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

