import client from './publicAxiosClient.js';

export const getServices = (params) => client.get('/public/services', { params });
export const getServiceById = (id) => client.get(`/public/services/${id}`);
