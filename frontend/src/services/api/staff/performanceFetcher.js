import client from './staffAxiosClient.js';

export const getPerformance = () => client.get('/staff/performance');
export const getMonthly = (params) => client.get('/staff/performance/monthly', { params });
export const getServices = () => client.get('/staff/performance/services');
export const getCustomers = () => client.get('/staff/performance/customers');
export const getAttendance = () => client.get('/staff/performance/attendance');
