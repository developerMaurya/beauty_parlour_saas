import client from './studentAxiosClient.js';

export const getDashboardOverview = () => client.get('/student/dashboard/overview');
export const getDashboardToday = () => client.get('/student/dashboard/today');
