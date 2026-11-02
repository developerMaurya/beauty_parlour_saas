import client from './customerAxiosClient.js';

export const getLoginHistory = () => client.get('/customer/security/login-history');
export const getDevices = () => client.get('/customer/security/devices');
export const removeDevice = (id) => client.delete(`/customer/security/devices/${id}`);
export const revokeAllDevices = () => client.post('/customer/security/revoke-all', {});
