/**
 * @file superadmin.api.js
 * @description Super Admin API Client Services
 */

import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => axiosClient.post('/superadmin/auth/login', credentials),
  logout: () => axiosClient.post('/superadmin/auth/logout'),
  getMe: () => axiosClient.get('/superadmin/auth/me'),
  getProfile: () => axiosClient.get('/superadmin/profile'),
  updateProfile: (data) => axiosClient.patch('/superadmin/profile', data),
  changePassword: (data) => axiosClient.post('/superadmin/auth/change-password', data),
};

export const dashboardApi = {
  getOverview: () => axiosClient.get('/superadmin/dashboard/overview'),
  getRevenue: () => axiosClient.get('/superadmin/dashboard/revenue'),
  getTenantGrowth: () => axiosClient.get('/superadmin/dashboard/tenant-growth'),
  getSubscriptionStats: () => axiosClient.get('/superadmin/dashboard/subscription-stats'),
  getPlanDistribution: () => axiosClient.get('/superadmin/dashboard/plan-distribution'),
  getRecentActivities: () => axiosClient.get('/superadmin/dashboard/recent-activities'),
  getExpiringSubscriptions: () => axiosClient.get('/superadmin/dashboard/expiring-subscriptions'),
};

export const tenantsApi = {
  list: (params) => axiosClient.get('/superadmin/tenants', { params }),
  get: (tenantId) => axiosClient.get(`/superadmin/tenants/${tenantId}`),
  create: (data) => axiosClient.post('/superadmin/tenants', data),
  update: (tenantId, data) => axiosClient.patch(`/superadmin/tenants/${tenantId}`, data),
  delete: (tenantId) => axiosClient.delete(`/superadmin/tenants/${tenantId}`),
  updateStatus: (tenantId, status) => axiosClient.patch(`/superadmin/tenants/${tenantId}/status`, { status }),
  updateGovernance: (tenantId, data) => axiosClient.patch(`/superadmin/tenants/${tenantId}/governance`, data),
  activate: (tenantId) => axiosClient.post(`/superadmin/tenants/${tenantId}/activate`),
  suspend: (tenantId, reason) => axiosClient.post(`/superadmin/tenants/${tenantId}/suspend`, { reason }),
  getActivity: (tenantId) => axiosClient.get(`/superadmin/tenants/${tenantId}/activity`),
  getUsage: (tenantId) => axiosClient.get(`/superadmin/tenants/${tenantId}/usage`),
  getDatabase: (tenantId) => axiosClient.get(`/superadmin/tenants/${tenantId}/database`),
  getDomains: (tenantId) => axiosClient.get(`/superadmin/tenants/${tenantId}/domains`),
  getSubscriptions: (tenantId) => axiosClient.get(`/superadmin/tenants/${tenantId}/subscriptions`),
};

export const provisioningApi = {
  start: (tenantId, options) => axiosClient.post(`/superadmin/provisioning/${tenantId}/start`, options),
  list: (params) => axiosClient.get('/superadmin/provisioning', { params }),
  get: (jobId) => axiosClient.get(`/superadmin/provisioning/${jobId}`),
  retry: (jobId) => axiosClient.post(`/superadmin/provisioning/${jobId}/retry`),
  cancel: (jobId) => axiosClient.post(`/superadmin/provisioning/${jobId}/cancel`),
  getTenantHistory: (tenantId) => axiosClient.get(`/superadmin/tenants/${tenantId}/provisioning-history`),
};

export const databasesApi = {
  list: (params) => axiosClient.get('/superadmin/databases', { params }),
  create: (data) => axiosClient.post('/superadmin/databases', data),
  get: (databaseId) => axiosClient.get(`/superadmin/databases/${databaseId}`),
  update: (databaseId, data) => axiosClient.patch(`/superadmin/databases/${databaseId}`, data),
  delete: (databaseId) => axiosClient.delete(`/superadmin/databases/${databaseId}`),
  getHealth: (databaseId) => axiosClient.get(`/superadmin/databases/${databaseId}/health`),
  testConnection: (databaseId) => axiosClient.post(`/superadmin/databases/${databaseId}/test-connection`),
  getTenants: (databaseId) => axiosClient.get(`/superadmin/databases/${databaseId}/tenants`),
  
  // Tenant Database Actions
  getTenantDb: (tenantId) => axiosClient.get(`/superadmin/tenants/${tenantId}/database`),
  updateTenantDb: (tenantId, data) => axiosClient.patch(`/superadmin/tenants/${tenantId}/database`, data),
  provisionTenantDb: (tenantId) => axiosClient.post(`/superadmin/tenants/${tenantId}/database/provision`),
  reconnectTenantDb: (tenantId) => axiosClient.post(`/superadmin/tenants/${tenantId}/database/reconnect`),
  backupTenantDb: (tenantId) => axiosClient.post(`/superadmin/tenants/${tenantId}/database/backup`),
  restoreTenantDb: (tenantId, backupId) => axiosClient.post(`/superadmin/tenants/${tenantId}/database/restore`, { backupId }),
  migrateTenantDb: (tenantId, data) => axiosClient.post(`/superadmin/tenants/${tenantId}/database/migrate`, data),
  checkTenantDbHealth: (tenantId) => axiosClient.get(`/superadmin/tenants/${tenantId}/database/health`),
};

export const plansApi = {
  list: (params) => axiosClient.get('/superadmin/plans', { params }),
  create: (data) => axiosClient.post('/superadmin/plans', data),
  get: (planId) => axiosClient.get(`/superadmin/plans/${planId}`),
  update: (planId, data) => axiosClient.patch(`/superadmin/plans/${planId}`, data),
  delete: (planId) => axiosClient.delete(`/superadmin/plans/${planId}`),
  updateStatus: (planId, status) => axiosClient.patch(`/superadmin/plans/${planId}/status`, { status }),
  getTenants: (planId) => axiosClient.get(`/superadmin/plans/${planId}/tenants`),
  getFeatures: (planId) => axiosClient.get(`/superadmin/plans/${planId}/features`),
  updateFeatures: (planId, features) => axiosClient.put(`/superadmin/plans/${planId}/features`, { features }),
  getLimits: (planId) => axiosClient.get(`/superadmin/plans/${planId}/limits`),
  updateLimits: (planId, limits) => axiosClient.put(`/superadmin/plans/${planId}/limits`, { limits }),
};

export const featuresApi = {
  list: (params) => axiosClient.get('/superadmin/features', { params }),
  create: (data) => axiosClient.post('/superadmin/features', data),
  get: (featureId) => axiosClient.get(`/superadmin/features/${featureId}`),
  update: (featureId, data) => axiosClient.patch(`/superadmin/features/${featureId}`, data),
  delete: (featureId) => axiosClient.delete(`/superadmin/features/${featureId}`),
  updateStatus: (featureId, status) => axiosClient.patch(`/superadmin/features/${featureId}/status`, { status }),
  
  // Categories
  listCategories: () => axiosClient.get('/superadmin/feature-categories'),
  createCategory: (data) => axiosClient.post('/superadmin/feature-categories', data),
  getCategory: (categoryId) => axiosClient.get(`/superadmin/feature-categories/${categoryId}`),
  updateCategory: (categoryId, data) => axiosClient.patch(`/superadmin/feature-categories/${categoryId}`, data),
  deleteCategory: (categoryId) => axiosClient.delete(`/superadmin/feature-categories/${categoryId}`),
};

export const addonsApi = {
  list: (params) => axiosClient.get('/superadmin/addons', { params }),
  create: (data) => axiosClient.post('/superadmin/addons', data),
  get: (addonId) => axiosClient.get(`/superadmin/addons/${addonId}`),
  update: (addonId, data) => axiosClient.patch(`/superadmin/addons/${addonId}`, data),
  delete: (addonId) => axiosClient.delete(`/superadmin/addons/${addonId}`),
  updateStatus: (addonId, status) => axiosClient.patch(`/superadmin/addons/${addonId}/status`, { status }),
  
  // Tenant assignments
  getTenantAddons: (tenantId) => axiosClient.get(`/superadmin/tenants/${tenantId}/addons`),
  assignTenantAddon: (tenantId, data) => axiosClient.post(`/superadmin/tenants/${tenantId}/addons`, data),
  updateTenantAddon: (tenantId, assignmentId, data) => axiosClient.patch(`/superadmin/tenants/${tenantId}/addons/${assignmentId}`, data),
  removeTenantAddon: (tenantId, assignmentId) => axiosClient.delete(`/superadmin/tenants/${tenantId}/addons/${assignmentId}`),
};

export const subscriptionsApi = {
  list: (params) => axiosClient.get('/superadmin/subscriptions', { params }),
  create: (data) => axiosClient.post('/superadmin/subscriptions', data),
  get: (subscriptionId) => axiosClient.get(`/superadmin/subscriptions/${subscriptionId}`),
  update: (subscriptionId, data) => axiosClient.patch(`/superadmin/subscriptions/${subscriptionId}`, data),
  renew: (subscriptionId, data) => axiosClient.post(`/superadmin/subscriptions/${subscriptionId}/renew`, data),
  upgrade: (subscriptionId, data) => axiosClient.post(`/superadmin/subscriptions/${subscriptionId}/upgrade`, data),
  downgrade: (subscriptionId, data) => axiosClient.post(`/superadmin/subscriptions/${subscriptionId}/downgrade`, data),
  cancel: (subscriptionId, reason) => axiosClient.post(`/superadmin/subscriptions/${subscriptionId}/cancel`, { reason }),
  extend: (subscriptionId, days) => axiosClient.post(`/superadmin/subscriptions/${subscriptionId}/extend`, { days }),
  changeStatus: (subscriptionId, status) => axiosClient.post(`/superadmin/subscriptions/${subscriptionId}/change-status`, { status }),
  getHistory: (subscriptionId) => axiosClient.get(`/superadmin/subscriptions/${subscriptionId}/history`),
};

export const domainsApi = {
  list: (params) => axiosClient.get('/superadmin/domains', { params }),
  getTenantDomains: (tenantId) => axiosClient.get(`/superadmin/tenants/${tenantId}/domains`),
  addTenantDomain: (tenantId, data) => axiosClient.post(`/superadmin/tenants/${tenantId}/domains`, data),
  get: (domainId) => axiosClient.get(`/superadmin/domains/${domainId}`),
  update: (domainId, data) => axiosClient.patch(`/superadmin/domains/${domainId}`, data),
  delete: (domainId) => axiosClient.delete(`/superadmin/domains/${domainId}`),
  verify: (domainId) => axiosClient.post(`/superadmin/domains/${domainId}/verify`),
  setPrimary: (domainId) => axiosClient.post(`/superadmin/domains/${domainId}/set-primary`),
  refreshSsl: (domainId) => axiosClient.post(`/superadmin/domains/${domainId}/refresh-ssl`),
  updateStatus: (domainId, status) => axiosClient.patch(`/superadmin/domains/${domainId}/status`, { status }),
};

export const billingApi = {
  getOverview: () => axiosClient.get('/superadmin/billing/overview'),
  getTransactions: (params) => axiosClient.get('/superadmin/billing/transactions', { params }),
  getTransaction: (transactionId) => axiosClient.get(`/superadmin/billing/transactions/${transactionId}`),
  getInvoices: (params) => axiosClient.get('/superadmin/billing/invoices', { params }),
  createInvoice: (data) => axiosClient.post('/superadmin/billing/invoices', data),
  getInvoice: (invoiceId) => axiosClient.get(`/superadmin/billing/invoices/${invoiceId}`),
  updateInvoice: (invoiceId, data) => axiosClient.patch(`/superadmin/billing/invoices/${invoiceId}`, data),
  getRefunds: (params) => axiosClient.get('/superadmin/billing/refunds', { params }),
  createRefund: (data) => axiosClient.post('/superadmin/billing/refunds', data),
  getRevenueReport: (params) => axiosClient.get('/superadmin/billing/reports/revenue', { params }),
};

export const couponsApi = {
  list: (params) => axiosClient.get('/superadmin/coupons', { params }),
  create: (data) => axiosClient.post('/superadmin/coupons', data),
  get: (couponId) => axiosClient.get(`/superadmin/coupons/${couponId}`),
  update: (couponId, data) => axiosClient.patch(`/superadmin/coupons/${couponId}`, data),
  delete: (couponId) => axiosClient.delete(`/superadmin/coupons/${couponId}`),
  updateStatus: (couponId, status) => axiosClient.patch(`/superadmin/coupons/${couponId}/status`, { status }),
};

export const usageApi = {
  getOverview: () => axiosClient.get('/superadmin/usage/overview'),
  getTenantsUsage: (params) => axiosClient.get('/superadmin/usage/tenants', { params }),
  getTenantUsage: (tenantId) => axiosClient.get(`/superadmin/usage/tenants/${tenantId}`),
  listLimits: () => axiosClient.get('/superadmin/limits'),
  createLimit: (data) => axiosClient.post('/superadmin/limits', data),
  getLimit: (limitId) => axiosClient.get(`/superadmin/limits/${limitId}`),
  updateLimit: (limitId, data) => axiosClient.patch(`/superadmin/limits/${limitId}`, data),
  deleteLimit: (limitId) => axiosClient.delete(`/superadmin/limits/${limitId}`),
  getTenantLimits: (tenantId) => axiosClient.get(`/superadmin/tenants/${tenantId}/limits`),
  updateTenantLimits: (tenantId, limits) => axiosClient.patch(`/superadmin/tenants/${tenantId}/limits`, { limits }),
};

export const settingsApi = {
  getSettings: () => axiosClient.get('/superadmin/settings'),
  updateSettings: (data) => axiosClient.patch('/superadmin/settings', data),
  getCategory: (category) => axiosClient.get(`/superadmin/settings/${category}`),
  updateCategory: (category, data) => axiosClient.patch(`/superadmin/settings/${category}`, data),
};

export const notificationsApi = {
  list: (params) => axiosClient.get('/superadmin/notifications', { params }),
  create: (data) => axiosClient.post('/superadmin/notifications', data),
  get: (notificationId) => axiosClient.get(`/superadmin/notifications/${notificationId}`),
  update: (notificationId, data) => axiosClient.patch(`/superadmin/notifications/${notificationId}`, data),
  delete: (notificationId) => axiosClient.delete(`/superadmin/notifications/${notificationId}`),
  send: (notificationId, data) => axiosClient.post(`/superadmin/notifications/${notificationId}/send`, data),
  getLogs: (params) => axiosClient.get('/superadmin/notification-logs', { params }),
};

export const supportApi = {
  list: (params) => axiosClient.get('/superadmin/support/tickets', { params }),
  create: (data) => axiosClient.post('/superadmin/support/tickets', data),
  get: (ticketId) => axiosClient.get(`/superadmin/support/tickets/${ticketId}`),
  update: (ticketId, data) => axiosClient.patch(`/superadmin/support/tickets/${ticketId}`, data),
  delete: (ticketId) => axiosClient.delete(`/superadmin/support/tickets/${ticketId}`),
  reply: (ticketId, message) => axiosClient.post(`/superadmin/support/tickets/${ticketId}/reply`, { message }),
  close: (ticketId) => axiosClient.post(`/superadmin/support/tickets/${ticketId}/close`),
  reopen: (ticketId) => axiosClient.post(`/superadmin/support/tickets/${ticketId}/reopen`),
};

export const auditLogsApi = {
  list: (params) => axiosClient.get('/superadmin/audit-logs', { params }),
  get: (logId) => axiosClient.get(`/superadmin/audit-logs/${logId}`),
  export: (format = 'json') => axiosClient.get('/superadmin/audit-logs/export', { params: { format } }),
};

export const verticalsApi = {
  list: () => axiosClient.get('/superadmin/verticals'),
  get: (verticalId) => axiosClient.get(`/superadmin/verticals/${verticalId}`),
  create: (data) => axiosClient.post('/superadmin/verticals', data),
  update: (verticalId, data) => axiosClient.patch(`/superadmin/verticals/${verticalId}`, data),
  delete: (verticalId) => axiosClient.delete(`/superadmin/verticals/${verticalId}`),
  getAnalytics: () => axiosClient.get('/superadmin/verticals-analytics'),
};

export const serviceTemplatesApi = {
  list: (params) => axiosClient.get('/superadmin/templates/services', { params }),
  get: (templateId) => axiosClient.get(`/superadmin/templates/services/${templateId}`),
  create: (data) => axiosClient.post('/superadmin/templates/services', data),
  update: (templateId, data) => axiosClient.patch(`/superadmin/templates/services/${templateId}`, data),
  delete: (templateId) => axiosClient.delete(`/superadmin/templates/services/${templateId}`),
  seedToTenant: (tenantId, verticalCode) => axiosClient.post(`/superadmin/tenants/${tenantId}/seed-catalog`, { verticalCode }),
};

export const themesApi = {
  list: () => axiosClient.get('/superadmin/themes'),
  get: (themeId) => axiosClient.get(`/superadmin/themes/${themeId}`),
  create: (data) => axiosClient.post('/superadmin/themes', data),
  update: (themeId, data) => axiosClient.patch(`/superadmin/themes/${themeId}`, data),
  delete: (themeId) => axiosClient.delete(`/superadmin/themes/${themeId}`),
  applyToTenant: (tenantId, themeCode) => axiosClient.post(`/superadmin/tenants/${tenantId}/theme`, { themeCode }),
};

