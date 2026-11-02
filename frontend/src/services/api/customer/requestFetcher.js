import client from './customerAxiosClient.js';

export const createRequest = (data) => client.post('/customer/requests', data);
export const getRequests = (params) => client.get('/customer/requests', { params });
export const getRequestById = (id) => client.get(`/customer/requests/${id}`);
export const updateRequest = (id, data) => client.put(`/customer/requests/${id}`, data);
export const deleteRequest = (id) => client.delete(`/customer/requests/${id}`);
export const cancelRequest = (id) => client.post(`/customer/requests/${id}/cancel`, {});
