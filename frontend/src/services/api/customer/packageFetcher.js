import client from './customerAxiosClient.js';

export const getPackages = (params) => client.get('/customer/packages', { params });
export const getPackageById = (id) => client.get(`/customer/packages/${id}`);
export const getMyPackages = (params) => client.get('/customer/packages/my', { params });
export const purchasePackage = (id, data) => client.post(`/customer/packages/${id}/purchase`, data);
export const getPackageUsage = (id) => client.get(`/customer/packages/${id}/usage`);
export const getRemainingServices = (id) => client.get(`/customer/packages/${id}/remaining-services`);
