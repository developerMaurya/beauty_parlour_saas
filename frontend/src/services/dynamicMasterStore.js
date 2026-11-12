/**
 * @file dynamicMasterStore.js
 * @description Database-Connected Dynamic Master Store for Roles, User Types, and Business Targets.
 * ALL ENTRIES ARE STORED IN AND FETCHED FROM MONGODB via /api/v1/admin/* endpoints.
 * Only 2 default items retained per user request.
 * @module frontend/src/services/dynamicMasterStore
 */

import { roleFetcher, userTypeFetcher, businessTargetFetcher } from './api/admin/adminApi.js';

export const DEFAULT_BUSINESS_TARGETS = [
  { id: 'ALL', code: 'ALL', name: 'All Portals (Master Global)', label: 'All Portals (Master Global)', emoji: '👑', color: '#facc15' },
  { id: 'PARLOUR', code: 'PARLOUR', name: 'Golden Beauty Parlour', label: 'Golden Beauty Parlour', emoji: '💄', color: '#c084fc' },
  { id: 'EVENTS', code: 'EVENTS', name: 'Jaygurudev Event & Mgmt', label: 'Jaygurudev Event & Mgmt', emoji: '🔱', color: '#fbbf24' },
  { id: 'PLOTTING', code: 'PLOTTING', name: 'Plotting & Real Estate', label: 'Plotting & Real Estate', emoji: '🏡', color: '#4ade80' },
  { id: 'RENT', code: 'RENT', name: 'Office & Commercial Rent', label: 'Office & Commercial Rent', emoji: '🏢', color: '#f59e0b' },
  { id: 'SOFTWARE', code: 'SOFTWARE', name: 'RB Software & Tech Hub', label: 'RB Software & Tech Hub', emoji: '💻', color: '#38bdf8' },
  { id: 'SYSTEM', code: 'SYSTEM', name: 'Central Administration', label: 'Central Administration', emoji: '⚙️', color: '#94a3b8' },
];

export let BUSINESS_TARGETS = [...DEFAULT_BUSINESS_TARGETS];

// EXACTLY 4 USER ROLES (ADMIN, STAFF, CUSTOMER, STUDENT)
export const DEFAULT_ROLES = [
  {
    _id: 'role_admin',
    name: 'Administrator',
    code: 'ADMIN',
    targetBusiness: 'ALL',
    description: 'Full administrative rights across all business portals',
    isSystem: true,
    status: 'active',
  },
  {
    _id: 'role_staff',
    name: 'Staff Member',
    code: 'STAFF',
    targetBusiness: 'ALL',
    description: 'Staff and operational team rights',
    isSystem: true,
    status: 'active',
  },
  {
    _id: 'role_customer',
    name: 'Customer / Client',
    code: 'CUSTOMER',
    targetBusiness: 'ALL',
    description: 'Customer profile with booking and service history',
    isSystem: true,
    status: 'active',
  },
  {
    _id: 'role_student',
    name: 'Academy Student',
    code: 'STUDENT',
    targetBusiness: 'PARLOUR',
    description: 'Cosmetology and beauty academy trainee access',
    isSystem: true,
    status: 'active',
  },
];

// 2 DEFAULT USER TYPES ONLY (as requested)
export const DEFAULT_USER_TYPES = [
  {
    _id: 'ut_admin',
    name: 'Administrator',
    code: 'ADMIN',
    targetBusiness: 'ALL',
    description: 'Full administrative privileges across business verticals',
    isSystem: true,
    status: 'active',
  },
  {
    _id: 'ut_staff',
    name: 'Staff Member',
    code: 'STAFF',
    targetBusiness: 'PARLOUR',
    description: 'Operational and salon staff employee',
    isSystem: true,
    status: 'active',
  },
];

// ─────────────────────────────────────────────────────────────
// 1. BUSINESS TARGETS / VERTICALS (DATABASE CONNECTED)
// ─────────────────────────────────────────────────────────────

export const fetchDynamicBusinessTargets = async () => {
  try {
    const res = await businessTargetFetcher.list({ limit: 100 });
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      BUSINESS_TARGETS = res.data.map((item) => ({
        id: item.code || item._id,
        _id: item._id,
        code: item.code,
        name: item.name,
        label: item.label || item.name,
        emoji: item.emoji || '🌐',
        color: item.color || '#3b82f6',
        description: item.description || '',
        status: item.status || 'active',
      }));
      window.dispatchEvent(new CustomEvent('dynamic_business_targets_changed', { detail: BUSINESS_TARGETS }));
      return BUSINESS_TARGETS;
    }
  } catch (err) {
    console.warn('[dynamicMasterStore] Falling back to standard targets:', err.message);
  }
  return BUSINESS_TARGETS;
};

// ─────────────────────────────────────────────────────────────
// 2. DYNAMIC ROLES (DATABASE CONNECTED) - 2 ITEMS DEFAULT
// ─────────────────────────────────────────────────────────────

export const fetchDynamicRoles = async (params = {}) => {
  try {
    const res = await roleFetcher.list({ limit: 100, ...params });
    const items = res.data || [];
    if (Array.isArray(items) && items.length > 0) {
      localStorage.setItem('kashi_db_roles_cache_v4', JSON.stringify(items));
      window.dispatchEvent(new CustomEvent('dynamic_roles_changed', { detail: items }));
      return items;
    }
  } catch (err) {
    console.warn('[dynamicMasterStore] Error fetching roles from DB, loading default:', err.message);
  }
  try {
    const cached = localStorage.getItem('kashi_db_roles_cache_v4');
    if (cached) return JSON.parse(cached);
  } catch (_) {}
  return DEFAULT_ROLES;
};

export const getDynamicRoles = () => {
  try {
    const cached = localStorage.getItem('kashi_db_roles_cache_v4');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return DEFAULT_ROLES;
};

export const addDynamicRole = async (roleData) => {
  const payload = {
    name: roleData.name.trim(),
    code: (roleData.code || roleData.name.replace(/[^a-zA-Z0-9]/g, '_')).toUpperCase(),
    targetBusiness: (roleData.targetBusiness || 'ALL').toUpperCase(),
    description: roleData.description || '',
    status: roleData.status || 'active',
    permissions: roleData.permissions || ['dashboard.view'],
  };
  const res = await roleFetcher.create(payload);
  const created = res.data || {
    _id: 'role_' + Date.now(),
    ...payload,
  };
  const current = getDynamicRoles();
  const updated = [created, ...current];
  localStorage.setItem('kashi_db_roles_cache_v4', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('dynamic_roles_changed', { detail: updated }));
  return created;
};

export const updateDynamicRole = async (roleId, updates) => {
  const payload = {
    ...updates,
    ...(updates.code ? { code: updates.code.toUpperCase() } : {}),
  };
  try {
    await roleFetcher.update(roleId, payload);
  } catch (_) {}
  const current = getDynamicRoles();
  const updated = current.map((r) => (r._id === roleId ? { ...r, ...payload } : r));
  localStorage.setItem('kashi_db_roles_cache_v4', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('dynamic_roles_changed', { detail: updated }));
  return updated.find((r) => r._id === roleId);
};

export const deleteDynamicRole = async (roleId) => {
  try {
    await roleFetcher.delete(roleId);
  } catch (_) {}
  const current = getDynamicRoles();
  const updated = current.filter((r) => r._id !== roleId);
  localStorage.setItem('kashi_db_roles_cache_v4', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('dynamic_roles_changed', { detail: updated }));
  return true;
};

// ─────────────────────────────────────────────────────────────
// 3. DYNAMIC USER TYPES (DATABASE CONNECTED) - 2 ITEMS DEFAULT
// ─────────────────────────────────────────────────────────────

export const fetchDynamicUserTypes = async (params = {}) => {
  try {
    const res = await userTypeFetcher.list({ limit: 100, ...params });
    const items = res.data || [];
    if (Array.isArray(items) && items.length > 0) {
      localStorage.setItem('kashi_db_user_types_cache_v2', JSON.stringify(items));
      window.dispatchEvent(new CustomEvent('dynamic_user_types_changed', { detail: items }));
      return items;
    }
  } catch (err) {
    console.warn('[dynamicMasterStore] Error fetching user types from DB, loading default:', err.message);
  }
  try {
    const cached = localStorage.getItem('kashi_db_user_types_cache_v2');
    if (cached) return JSON.parse(cached);
  } catch (_) {}
  return DEFAULT_USER_TYPES;
};

export const getDynamicUserTypes = () => {
  try {
    const cached = localStorage.getItem('kashi_db_user_types_cache_v2');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return DEFAULT_USER_TYPES;
};

export const addDynamicUserType = async (typeData) => {
  const payload = {
    name: typeData.name.trim(),
    code: (typeData.code || typeData.name.replace(/[^a-zA-Z0-9]/g, '_')).toUpperCase(),
    targetBusiness: (typeData.targetBusiness || 'ALL').toUpperCase(),
    description: typeData.description || '',
    status: typeData.status || 'active',
  };
  const res = await userTypeFetcher.create(payload);
  const created = res.data || {
    _id: 'ut_' + Date.now(),
    ...payload,
  };
  const current = getDynamicUserTypes();
  const updated = [created, ...current];
  localStorage.setItem('kashi_db_user_types_cache_v2', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('dynamic_user_types_changed', { detail: updated }));
  return created;
};

export const updateDynamicUserType = async (typeId, updates) => {
  const payload = {
    ...updates,
    ...(updates.code ? { code: updates.code.toUpperCase() } : {}),
  };
  try {
    await userTypeFetcher.update(typeId, payload);
  } catch (_) {}
  const current = getDynamicUserTypes();
  const updated = current.map((t) => (t._id === typeId ? { ...t, ...payload } : t));
  localStorage.setItem('kashi_db_user_types_cache_v2', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('dynamic_user_types_changed', { detail: updated }));
  return updated.find((t) => t._id === typeId);
};

export const deleteDynamicUserType = async (typeId) => {
  try {
    await userTypeFetcher.delete(typeId);
  } catch (_) {}
  const current = getDynamicUserTypes();
  const updated = current.filter((t) => t._id !== typeId);
  localStorage.setItem('kashi_db_user_types_cache_v2', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('dynamic_user_types_changed', { detail: updated }));
  return true;
};
