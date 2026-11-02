import client from './customerAxiosClient.js';

export const getServiceHistory = (params) => client.get('/customer/services/history', { params });
export const getServiceHistoryById = (id) => client.get(`/customer/services/history/${id}`);
