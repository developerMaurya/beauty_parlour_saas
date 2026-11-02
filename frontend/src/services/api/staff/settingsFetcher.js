import client from './staffAxiosClient.js';

export const getSettings = () => client.get('/staff/settings');
export const updateSettings = (data) => client.patch('/staff/settings', data);
export const getSecuritySettings = () => client.get('/staff/settings/security');
export const updateSecuritySettings = (data) => client.patch('/staff/settings/security', data);
export const getPrivacySettings = () => client.get('/staff/settings/privacy');
export const updatePrivacySettings = (data) => client.patch('/staff/settings/privacy', data);
