import client from './studentAxiosClient.js';

export const getLoginHistory = () => client.get('/student/security/login-history');
export const getDevices = () => client.get('/student/security/devices');
export const revokeDevice = (id) => client.delete(`/student/security/devices/${id}`);
export const revokeAllDevices = () => client.post('/student/security/revoke-all');
export const revokeAll = revokeAllDevices;
