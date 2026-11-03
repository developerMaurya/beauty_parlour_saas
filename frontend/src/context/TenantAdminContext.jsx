/**
 * @file TenantAdminContext.jsx
 * @description Authentication & Context Provider for Tenant Admin System.
 * Manages tenant user profile, active tenant info, branch switcher, and dynamic permissions.
 * @module frontend/src/context/TenantAdminContext
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authFetcher, branchFetcher } from '../services/api/admin/adminApi.js';

const TenantAdminContext = createContext(null);

export const TenantAdminProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('tenant_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [tenant, setTenant] = useState(() => {
    try {
      const stored = localStorage.getItem('tenant_meta');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(() => {
    return localStorage.getItem('active_branch_id') || '';
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load branches for current tenant
  const loadBranches = useCallback(async () => {
    try {
      const token = localStorage.getItem('tenant_access_token');
      if (!token) return;
      const res = await branchFetcher.list({ limit: 100 });
      if (res?.data) {
        setBranches(res.data);
      }
    } catch (err) {
      console.warn('Could not load branches:', err?.message);
    }
  }, []);

  // Verify Auth on mount
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('tenant_access_token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authFetcher.me();
      if (res?.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('tenant_user', JSON.stringify(res.data.user));
        if (res.data.tenant) {
          setTenant(res.data.tenant);
          localStorage.setItem('tenant_meta', JSON.stringify(res.data.tenant));
        }
        await loadBranches();
      }
    } catch (err) {
      console.warn('Tenant auth verification failed:', err?.message || err);
      localStorage.removeItem('tenant_access_token');
      localStorage.removeItem('tenant_refresh_token');
      localStorage.removeItem('tenant_user');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [loadBranches]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async ({ tenantSlugOrId, email, password }) => {
    setIsLoading(true);
    try {
      localStorage.setItem('active_tenant_id', tenantSlugOrId);
      localStorage.setItem('active_tenant_slug', tenantSlugOrId);

      const res = await authFetcher.login({ email, password });
      const { accessToken, refreshToken, user: userData, tenant: tenantData, branch } = res.data;

      localStorage.setItem('tenant_access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('tenant_refresh_token', refreshToken);
      }
      localStorage.setItem('tenant_user', JSON.stringify(userData));
      if (tenantData) {
        localStorage.setItem('tenant_meta', JSON.stringify(tenantData));
        setTenant(tenantData);
      }
      if (branch?._id) {
        localStorage.setItem('active_branch_id', branch._id);
        setSelectedBranchId(branch._id);
      } else {
        localStorage.removeItem('active_branch_id');
        setSelectedBranchId('');
      }

      setUser(userData);
      await loadBranches();
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  // Branch switcher
  const switchBranch = async (branchId) => {
    try {
      await authFetcher.switchBranch(branchId || null);
      if (branchId) {
        localStorage.setItem('active_branch_id', branchId);
        setSelectedBranchId(branchId);
      } else {
        localStorage.removeItem('active_branch_id');
        setSelectedBranchId('');
      }
      window.location.reload();
    } catch (err) {
      console.error('Failed to switch branch:', err);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authFetcher.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem('tenant_access_token');
      localStorage.removeItem('tenant_refresh_token');
      localStorage.removeItem('tenant_user');
      localStorage.removeItem('active_branch_id');
      setUser(null);
      setTenant(null);
      setBranches([]);
      window.location.href = '/admin/login';
    }
  };

  // Permission helper
  const hasPermission = (permissionCode) => {
    if (!user) return false;
    if (user.role === 'ADMIN' || user.userType === 'ADMIN') return true;
    if (user.permissions?.includes('*')) return true;
    return user.permissions?.includes(permissionCode) || false;
  };

  const selectedBranch = branches.find((b) => b._id === selectedBranchId) || {
    _id: '',
    name: 'All Branches',
  };

  const value = {
    user,
    tenant,
    branches,
    selectedBranchId,
    selectedBranch,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    switchBranch,
    checkAuth,
    loadBranches,
    hasPermission,
  };

  return <TenantAdminContext.Provider value={value}>{children}</TenantAdminContext.Provider>;
};

export const useTenantAdmin = () => {
  const context = useContext(TenantAdminContext);
  if (!context) {
    throw new Error('useTenantAdmin must be used within a TenantAdminProvider');
  }
  return context;
};

export { TenantAdminContext };
