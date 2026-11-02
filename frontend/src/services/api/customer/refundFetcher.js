import client from './customerAxiosClient.js';

export const createRefundRequest = (data) => client.post('/customer/refund-requests', data);
export const getRefundRequests = (params) => client.get('/customer/refund-requests', { params });
export const getRefundRequestById = (id) => client.get(`/customer/refund-requests/${id}`);
export const cancelRefundRequest = (id) => client.post(`/customer/refund-requests/${id}/cancel`, {});
