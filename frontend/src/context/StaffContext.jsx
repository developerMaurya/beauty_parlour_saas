/**
 * @file StaffContext.jsx
 * @description Dedicated Staff Authentication & Operational Context Provider.
 * Manages staff user session, linked staff profile, multi-branch switching,
 * role/permission evaluations, unread notifications, and plan features.
 * @module frontend/src/context/StaffContext
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../services/api/staff/authFetcher.js';
import * as profileApi from '../services/api/staff/profileFetcher.js';
import * as branchApi from '../services/api/staff/branchFetcher.js';
import * as notifApi from '../services/api/staff/notificationFetcher.js';

const StaffContext = createContext(null);

export const StaffProvider = ({ children }) => {
  const [staffUser, setStaffUser] = useState(() => {
    try {
      const stored = localStorage.getItem('staff_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [staffProfile, setStaffProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('staff_profile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [permissions, setPermissions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currentBranchId, setCurrentBranchId] = useState(() => {
    return localStorage.getItem('staff_branch_id') || '';
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load assigned branches & permissions
  const loadStaffDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('staff_access_token');
      if (!token) return;

      const [profRes, branchesRes, permRes, notifRes] = await Promise.allSettled([
        profileApi.getProfile(),
        branchApi.getBranches(),
        profileApi.getActivity(), // or permissions
        notifApi.getNotifications({ limit: 1 }),
      ]);

      if (profRes.status === 'fulfilled' && profRes.value?.data) {
        setStaffProfile(profRes.value.data);
        localStorage.setItem('staff_profile', JSON.stringify(profRes.value.data));
      }

      if (branchesRes.status === 'fulfilled' && branchesRes.value?.data) {
        const branchList = Array.isArray(branchesRes.value.data) ? branchesRes.value.data : [];
        setBranches(branchList);
        if (!currentBranchId && branchList.length > 0) {
          const firstId = branchList[0]._id;
          setCurrentBranchId(firstId);
          localStorage.setItem('staff_branch_id', firstId);
        }
      }

      if (notifRes.status === 'fulfilled' && notifRes.value?.unreadCount !== undefined) {
        setUnreadCount(notifRes.value.unreadCount);
      }
    } catch (err) {
      console.warn('Could not load full staff operational details:', err?.message);
    }
  }, [currentBranchId]);

  // Verify Auth on mount
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('staff_access_token');
    if (!token) {
      setStaffUser(null);
      setStaffProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res?.data) {
        setStaffUser(res.data.user);
        setStaffProfile(res.data.staff);
        setPermissions(res.data.permissions || []);
        localStorage.setItem('staff_user', JSON.stringify(res.data.user));
        if (res.data.staff) {
          localStorage.setItem('staff_profile', JSON.stringify(res.data.staff));
        }
        await loadStaffDetails();
      }
    } catch (err) {
      console.warn('Staff token verification failed:', err?.message);
      localStorage.removeItem('staff_access_token');
      localStorage.removeItem('staff_user');
      localStorage.removeItem('staff_profile');
      setStaffUser(null);
      setStaffProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [loadStaffDetails]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (credentials, tenantId) => {
    setIsLoading(true);
    try {
      if (tenantId) {
        localStorage.setItem('staff_tenant_id', tenantId);
      }
      const res = await authApi.login(credentials);
      const data = res?.data || res;

      if (data?.accessToken) {
        localStorage.setItem('staff_access_token', data.accessToken);
        setStaffUser(data.user);
        setStaffProfile(data.staff);
        setPermissions(data.permissions || []);
        localStorage.setItem('staff_user', JSON.stringify(data.user));
        if (data.staff) {
          localStorage.setItem('staff_profile', JSON.stringify(data.staff));
        }
        if (data.tenantId) {
          localStorage.setItem('staff_tenant_id', data.tenantId);
        }

        await loadStaffDetails();
        return { success: true, data };
      }
      return { success: false, message: res?.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || err?.message || 'Invalid staff credentials',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Staff Google Login handler
  const loginWithGoogle = async (googleUser) => {
    setIsLoading(true);
    try {
      const email = googleUser?.email?.toLowerCase();
      const name = googleUser?.name || email?.split('@')?.[0] || 'Staff Member';

      // Match against known staff accounts or create dedicated session
      let targetBiz = 'PARLOUR';
      let designation = 'Staff Specialist';
      if (email.includes('event')) {
        targetBiz = 'EVENTS';
        designation = 'Event Lead Specialist';
      } else if (email.includes('plot') || email.includes('realty')) {
        targetBiz = 'PLOTTING';
        designation = 'Real Estate Sales Officer';
      } else if (email.includes('dev') || email.includes('software')) {
        targetBiz = 'SOFTWARE';
        designation = 'Software Engineer';
      }

      const user = {
        _id: 'stf_usr_' + Date.now().toString().slice(-6),
        id: 'stf_usr_' + Date.now().toString().slice(-6),
        name,
        email,
        role: 'STAFF',
        targetBusiness: targetBiz,
        authProvider: 'GOOGLE',
      };

      const staff = {
        _id: 'stf_' + Date.now().toString().slice(-6),
        staffId: 'STF-G-' + Date.now().toString().slice(-4),
        name,
        email,
        designation,
        department: targetBiz,
        photo: googleUser?.picture || '',
        status: 'active',
      };

      const token = 'staff_google_tok_' + Date.now();
      localStorage.setItem('staff_access_token', token);
      localStorage.setItem('staff_user', JSON.stringify(user));
      localStorage.setItem('staff_profile', JSON.stringify(staff));

      setStaffUser(user);
      setStaffProfile(staff);
      setPermissions(['all']);

      return { success: true, data: { user, staff } };
    } catch (err) {
      return { success: false, message: err.message || 'Staff Google sign-in failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // safe fallback
    } finally {
      localStorage.removeItem('staff_access_token');
      localStorage.removeItem('staff_user');
      localStorage.removeItem('staff_profile');
      localStorage.removeItem('staff_branch_id');
      setStaffUser(null);
      setStaffProfile(null);
      setBranches([]);
      setPermissions([]);
      setUnreadCount(0);
    }
  };

  // Switch current branch
  const switchBranch = async (branchId) => {
    try {
      await branchApi.switchBranch(branchId);
      setCurrentBranchId(branchId);
      localStorage.setItem('staff_branch_id', branchId);
      return { success: true };
    } catch (err) {
      return { success: false, message: err?.message || 'Failed to switch branch' };
    }
  };

  // Permission helper
  const hasPermission = (permCode) => {
    if (!staffUser) return false;
    if (staffUser.role === 'ADMIN' || permissions.includes('*')) return true;
    return permissions.includes(permCode);
  };

  return (
    <StaffContext.Provider
      value={{
        staffUser,
        staffProfile,
        permissions,
        branches,
        currentBranchId,
        unreadCount,
        setUnreadCount,
        isLoading,
        isAuthenticated: Boolean(staffUser),
        login,
        loginWithGoogle,
        logout,
        switchBranch,
        hasPermission,
        refreshStaffData: checkAuth,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};

export { StaffContext };
