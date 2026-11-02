import client from './staffAxiosClient.js';

export const getPayments = (params) => client.get('/staff/payments', { params });
export const getPayment = (id) => client.get(`/staff/payments/${id}`);
