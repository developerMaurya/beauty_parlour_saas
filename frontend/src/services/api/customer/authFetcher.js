import client from './customerAxiosClient.js';

export const register = (data) => client.post('/customer/auth/register', data);
export const login = (data) => client.post('/customer/auth/login', data);
export const refreshToken = () => client.post('/customer/auth/refresh');
export const logout = (data) => client.post('/customer/auth/logout', data);
export const logoutAll = () => client.post('/customer/auth/logout-all', {});
export const getMe = () => client.get('/customer/auth/me');
export const changePassword = (data) => client.post('/customer/auth/change-password', data);
export const forgotPassword = (data) => client.post('/customer/auth/forgot-password', data);
export const resetPassword = (data) => client.post('/customer/auth/reset-password', data);
export const getSessions = () => client.get('/customer/auth/sessions');
export const getSessionById = (id) => client.get(`/customer/auth/sessions/${id}`);
export const revokeSession = (id) => client.delete(`/customer/auth/sessions/${id}`);
export const revokeAllSessions = () => client.post('/customer/auth/sessions/revoke-all', {});
