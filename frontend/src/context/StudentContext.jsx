/**
 * @file StudentContext.jsx
 * @description React Authentication & Academy Context Provider for Student Portal.
 * Manages active student session, profile, active enrollment, branch, and unread notifications.
 * @module frontend/src/context/StudentContext
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../services/api/student/authFetcher.js';
import * as notifApi from '../services/api/student/notificationFetcher.js';

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [studentUser, setStudentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('student_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [studentProfile, setStudentProfile] = useState(null);
  const [branch, setBranch] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStudentData = async () => {
    const token = localStorage.getItem('student_access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const [meRes, notifRes] = await Promise.allSettled([
        authApi.getMe(),
        notifApi.getNotifications(),
      ]);

      if (meRes.status === 'fulfilled' && meRes.value?.data) {
        setStudentUser(meRes.value.data.user);
        setStudentProfile(meRes.value.data.student);
        setBranch(meRes.value.data.branch);
        localStorage.setItem('student_user', JSON.stringify(meRes.value.data.user));
      }

      if (notifRes.status === 'fulfilled' && notifRes.value?.data) {
        setUnreadCount(notifRes.value.data.unreadCount || 0);
      }
    } catch (err) {
      console.warn('[StudentContext] Session initialization error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const login = async ({ email, password }, tenantId) => {
    try {
      if (tenantId) {
        localStorage.setItem('student_tenant_id', tenantId);
      }
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        localStorage.setItem('student_access_token', res.data.accessToken);
        localStorage.setItem('student_user', JSON.stringify(res.data.user));
        if (res.data.user?.tenantId) {
          localStorage.setItem('student_tenant_id', res.data.user.tenantId);
        }
        setStudentUser(res.data.user);
        setStudentProfile(res.data.student);
        await fetchStudentData();
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Authentication error. Please check your credentials.',
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout error:', err.message);
    } finally {
      localStorage.removeItem('student_access_token');
      localStorage.removeItem('student_user');
      setStudentUser(null);
      setStudentProfile(null);
      setBranch(null);
      setUnreadCount(0);
    }
  };

  const value = {
    studentUser,
    studentProfile,
    branch,
    unreadCount,
    loading,
    login,
    logout,
    refreshStudentData: fetchStudentData,
    isAuthenticated: !!studentUser,
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

export { StudentContext };
