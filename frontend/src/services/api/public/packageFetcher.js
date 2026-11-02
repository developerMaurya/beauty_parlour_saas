import client from './publicAxiosClient.js';

export const getPackages = (params) => client.get('/public/packages', { params });
export const getPackageById = (id) => client.get(`/public/packages/${id}`);
