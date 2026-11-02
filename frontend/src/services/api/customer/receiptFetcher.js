import client from './customerAxiosClient.js';

export const getReceipts = (params) => client.get('/customer/payments/receipts', { params });
export const downloadReceipt = (id) => client.get(`/customer/payments/receipts/${id}/download`);
