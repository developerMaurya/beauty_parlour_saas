import client from './staffAxiosClient.js';

export const getPackages = (params) => client.get('/staff/packages', { params });
export const getPackage = (id) => client.get(`/staff/packages/${id}`);
