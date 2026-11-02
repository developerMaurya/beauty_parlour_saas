import client from './studentAxiosClient.js';

export const login = (data) => client.post('/student/auth/login', data);
export const refreshToken = () => client.post('/student/auth/refresh');
export const logout = () => client.post('/student/auth/logout');
export const logoutAll = () => client.post('/student/auth/logout-all');
export const getMe = () => client.get('/student/auth/me');
export const changePassword = (data) => client.post('/student/auth/change-password', data);
export const forgotPassword = (data) => client.post('/student/auth/forgot-password', data);
export const resetPassword = (data) => client.post('/student/auth/reset-password', data);
export const getSessions = () => client.get('/student/auth/sessions');
export const getSessionById = (id) => client.get(`/student/auth/sessions/${id}`);
export const revokeSession = (id) => client.delete(`/student/auth/sessions/${id}`);
export const revokeAllSessions = () => client.post('/student/auth/sessions/revoke-all');
export const revokeAllOtherSessions = revokeAllSessions;
