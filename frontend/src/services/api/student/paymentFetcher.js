import client from './studentAxiosClient.js';

export const getPayments = (params) => client.get('/student/payments', { params });
export const getAll = getPayments;
export const getPaymentById = (id) => client.get(`/student/payments/${id}`);
export const getById = getPaymentById;
export const getPaymentSummary = (params) => client.get('/student/payments/summary', { params });
export const getSummary = getPaymentSummary;
export const getPaymentHistory = (params) => client.get('/student/payments/history', { params });
export const getHistory = getPaymentHistory;
export const getDuePayments = () => client.get('/student/payments/due');
export const getDue = getDuePayments;
export const getUpcomingPayments = () => client.get('/student/payments/upcoming');
export const getUpcoming = getUpcomingPayments;
export const getInvoices = (params) => client.get('/student/payments/invoices', { params });
export const getInvoiceById = (id) => client.get(`/student/payments/invoices/${id}`);
export const downloadInvoice = (id) => client.get(`/student/payments/invoices/${id}/download`);
