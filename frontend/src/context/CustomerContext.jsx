/**
 * @file CustomerContext.jsx
 * @description React Authentication & Salon Context Provider for Customer Portal.
 * Manages active customer session, profile, branch preference, and unread notifications.
 * @module frontend/src/context/CustomerContext
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../services/api/customer/authFetcher.js';
import * as notifApi from '../services/api/customer/notificationFetcher.js';
import * as aptApi from '../services/api/customer/appointmentFetcher.js';

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      const stored = localStorage.getItem('customer_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [activeBranch, setActiveBranch] = useState(() => {
    try {
      const stored = localStorage.getItem('customer_branch');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [unreadCount, setUnreadCount] = useState(0);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomerData = async () => {
    const token = localStorage.getItem('customer_access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const [meRes, notifRes, aptRes] = await Promise.allSettled([
        authApi.getMe(),
        notifApi.getNotifications({ unreadOnly: true }),
        aptApi.getTodayAppointments(),
      ]);

      if (meRes.status === 'fulfilled' && meRes.value?.data) {
        const profile = meRes.value.data;
        setCustomer(profile);
        localStorage.setItem('customer_user', JSON.stringify(profile));
        if (profile.preferredBranch && !activeBranch) {
          setActiveBranch(profile.preferredBranch);
          localStorage.setItem('customer_branch', JSON.stringify(profile.preferredBranch));
          localStorage.setItem('customer_branch_id', profile.preferredBranch._id || profile.preferredBranch);
        }
      }

      if (notifRes.status === 'fulfilled' && notifRes.value?.data) {
        setUnreadCount(notifRes.value.data.unreadCount || (Array.isArray(notifRes.value.data.notifications) ? notifRes.value.data.notifications.length : 0));
      }

      if (aptRes.status === 'fulfilled' && aptRes.value?.data) {
        const appointments = aptRes.value.data;
        if (Array.isArray(appointments) && appointments.length > 0) {
          setActiveAppointment(appointments[0]);
        }
      }
    } catch (err) {
      console.warn('[CustomerContext] Session initialization error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();

    const handleSessionExpired = () => {
      setCustomer(null);
      setActiveBranch(null);
      setActiveAppointment(null);
      localStorage.removeItem('customer_access_token');
      localStorage.removeItem('customer_refresh_token');
      localStorage.removeItem('customer_user');
      localStorage.removeItem('customer_branch');
      localStorage.removeItem('customer_branch_id');
    };

    window.addEventListener('customer_auth_expired', handleSessionExpired);
    return () => window.removeEventListener('customer_auth_expired', handleSessionExpired);
  }, []);

  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ identifier, password });
      const { customer: userProfile, accessToken, refreshToken } = res.data;

      localStorage.setItem('customer_access_token', accessToken);
      localStorage.setItem('customer_refresh_token', refreshToken);
      localStorage.setItem('customer_user', JSON.stringify(userProfile));

      setCustomer(userProfile);
      if (userProfile.preferredBranch) {
        setActiveBranch(userProfile.preferredBranch);
        localStorage.setItem('customer_branch', JSON.stringify(userProfile.preferredBranch));
        localStorage.setItem('customer_branch_id', userProfile.preferredBranch._id || userProfile.preferredBranch);
      }

      await fetchCustomerData();
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await authApi.register(formData);
      const { customer: userProfile, accessToken, refreshToken } = res.data;

      localStorage.setItem('customer_access_token', accessToken);
      localStorage.setItem('customer_refresh_token', refreshToken);
      localStorage.setItem('customer_user', JSON.stringify(userProfile));

      setCustomer(userProfile);
      await fetchCustomerData();
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('customer_refresh_token');
    try {
      await authApi.logout({ refreshToken });
    } catch (err) {
      console.warn('[CustomerContext] Logout API error:', err.message);
    } finally {
      localStorage.removeItem('customer_access_token');
      localStorage.removeItem('customer_refresh_token');
      localStorage.removeItem('customer_user');
      localStorage.removeItem('customer_branch');
      localStorage.removeItem('customer_branch_id');
      setCustomer(null);
      setActiveBranch(null);
      setActiveAppointment(null);
    }
  };

  const switchBranch = (branchObj) => {
    setActiveBranch(branchObj);
    if (branchObj) {
      localStorage.setItem('customer_branch', JSON.stringify(branchObj));
      localStorage.setItem('customer_branch_id', branchObj._id || branchObj);
    } else {
      localStorage.removeItem('customer_branch');
      localStorage.removeItem('customer_branch_id');
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        customer,
        activeBranch,
        unreadCount,
        activeAppointment,
        loading,
        isAuthenticated: !!customer,
        login,
        register,
        logout,
        switchBranch,
        refreshProfile: fetchCustomerData,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}

export { CustomerContext };
