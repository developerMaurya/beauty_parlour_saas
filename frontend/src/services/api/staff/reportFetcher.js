import client from './staffAxiosClient.js';

export const getAttendanceReport = (params) => client.get('/staff/reports/attendance', { params });
export const getAppointmentsReport = (params) => client.get('/staff/reports/appointments', { params });
export const getServicesReport = (params) => client.get('/staff/reports/services', { params });
export const getEarningsReport = (params) => client.get('/staff/reports/earnings', { params });
export const getCommissionReport = (params) => client.get('/staff/reports/commission', { params });
export const getHomeServicesReport = (params) => client.get('/staff/reports/home-services', { params });
export const getPerformanceReport = (params) => client.get('/staff/reports/performance', { params });
