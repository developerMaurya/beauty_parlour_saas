import client from './customerAxiosClient.js';

export const getInvoices = (params) => client.get('/customer/payments/invoices', { params });
export const getInvoiceById = (id) => client.get(`/customer/payments/invoices/${id}`);
export const downloadInvoice = (id) => client.get(`/customer/payments/invoices/${id}/download`);
