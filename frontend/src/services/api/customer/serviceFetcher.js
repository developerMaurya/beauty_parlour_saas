import client from './customerAxiosClient.js';

export const getServices = (params) => client.get('/customer/services', { params });
export const getServiceById = (id) => client.get(`/customer/services/${id}`);
