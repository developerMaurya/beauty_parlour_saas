import client from './staffAxiosClient.js';

export const login = (data) => client.post('/staff/auth/login', data);
export const refreshToken = () => client.post('/staff/auth/refresh');
export const logout = () => client.post('/staff/auth/logout');
export const logoutAll = () => client.post('/staff/auth/logout-all');
export const getMe = () => client.get('/staff/auth/me');
export const changePassword = (data) => client.post('/staff/auth/change-password', data);
export const forgotPassword = (data) => client.post('/staff/auth/forgot-password', data);
export const resetPassword = (data) => client.post('/staff/auth/reset-password', data);
export const getSessions = () => client.get('/staff/auth/sessions');
export const getSessionById = (id) => client.get(`/staff/auth/sessions/${id}`);
export const revokeSession = (id) => client.delete(`/staff/auth/sessions/${id}`);
export const revokeAllSessions = () => client.post('/staff/auth/sessions/revoke-all');
export const revokeAllOtherSessions = revokeAllSessions;
