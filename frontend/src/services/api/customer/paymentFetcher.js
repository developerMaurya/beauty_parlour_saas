import client from './customerAxiosClient.js';

export const getPayments = (params) => client.get('/customer/payments', { params });
export const getPaymentSummary = () => client.get('/customer/payments/summary');
export const getPaymentHistory = (params) => client.get('/customer/payments/history', { params });
export const getPendingPayments = () => client.get('/customer/payments/pending');
export const getPaymentById = (id) => client.get(`/customer/payments/${id}`);
export const createPaymentOrder = (data) => client.post('/customer/payments/create-order', data);
export const verifyPayment = (data) => client.post('/customer/payments/verify', data);
export const recordOfflinePayment = (data) => client.post('/customer/payments/offline', data);
