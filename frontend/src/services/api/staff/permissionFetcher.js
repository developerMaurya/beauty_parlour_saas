import client from './staffAxiosClient.js';

export const getPermissions = () => client.get('/staff/permissions');
export const checkPermission = (perm) => client.get('/staff/permissions/check', { params: { permission: perm } });
