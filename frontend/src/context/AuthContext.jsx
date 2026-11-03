/**
 * @file AuthContext.jsx
 * @description Super Admin Authentication Context & Session State Manager
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api/superadmin.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sa_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('sa_access_token'));
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('sa_access_token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res?.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('sa_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn('Auth verification failed:', err?.message || err);
      // Attempt token refresh or clear if failed
      localStorage.removeItem('sa_access_token');
      localStorage.removeItem('sa_refresh_token');
      localStorage.removeItem('sa_user');
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (emailOrUsername, password) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ emailOrUsername, password });
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userData } = res.data;

      // Verify that user is Super Admin (support both 'superadmin' and 'SUPER_ADMIN')
      const roleStr = (userData?.role || '').toLowerCase();
      if (roleStr !== 'superadmin' && roleStr !== 'super_admin') {
        throw new Error('Access denied: You do not possess Super Admin privileges.');
      }

      // Ensure normalized role
      userData.role = 'SUPER_ADMIN';

      localStorage.setItem('sa_access_token', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('sa_refresh_token', newRefreshToken);
      }
      localStorage.setItem('sa_user', JSON.stringify(userData));

      setAccessToken(newAccessToken);
      setUser(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem('sa_access_token');
      localStorage.removeItem('sa_refresh_token');
      localStorage.removeItem('sa_user');
      setUser(null);
      setAccessToken(null);
      window.location.href = '/superadmin/login';
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('sa_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    login,
    logout,
    checkAuth,
    updateUser,
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

export { AuthContext };
