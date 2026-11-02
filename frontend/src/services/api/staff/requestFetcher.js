import client from './staffAxiosClient.js';

export const createRequest = (data) => client.post('/staff/requests', data);
export const getRequests = (params) => client.get('/staff/requests', { params });
export const getRequest = (id) => client.get(`/staff/requests/${id}`);
export const updateRequest = (id, data) => client.patch(`/staff/requests/${id}`, data);
export const cancelRequest = (id) => client.post(`/staff/requests/${id}/cancel`);
