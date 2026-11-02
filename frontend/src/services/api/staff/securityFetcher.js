import client from './staffAxiosClient.js';

export const getLoginHistory = () => client.get('/staff/security/login-history');
export const getDevices = () => client.get('/staff/security/devices');
export const removeDevice = (id) => client.delete(`/staff/security/devices/${id}`);
export const logoutAllDevices = () => client.post('/staff/security/logout-all');
export const setupMfa = () => client.post('/staff/security/mfa/setup');
export const verifyMfa = (token) => client.post('/staff/security/mfa/verify', { token });
export const disableMfa = () => client.post('/staff/security/mfa/disable');
export const getActivityLogs = () => client.get('/staff/activity');
export const getAuditLogs = () => client.get('/staff/audit-logs');
