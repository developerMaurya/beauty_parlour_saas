import client from './customerAxiosClient.js';

export const getOverviewReport = () => client.get('/customer/reports/overview');
export const getAppointmentsReport = (params) => client.get('/customer/reports/appointments', { params });
export const getServicesReport = (params) => client.get('/customer/reports/services', { params });
export const getPaymentsReport = (params) => client.get('/customer/reports/payments', { params });
export const getVisitsReport = (params) => client.get('/customer/reports/visits', { params });
export const getReviewsReport = (params) => client.get('/customer/reports/reviews', { params });
export const getPackagesReport = (params) => client.get('/customer/reports/packages', { params });
export const getCompleteReport = () => client.get('/customer/reports/complete');
