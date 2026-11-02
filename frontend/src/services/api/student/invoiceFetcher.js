import client from './studentAxiosClient.js';

export const getInvoices = () => client.get('/student/payments/invoices');
export const getInvoiceById = (id) => client.get(`/student/payments/invoices/${id}`);
export const downloadInvoice = (id) => client.get(`/student/payments/invoices/${id}/download`);
