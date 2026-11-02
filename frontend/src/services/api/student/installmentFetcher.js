import client from './studentAxiosClient.js';

export const getInstallments = () => client.get('/student/payments/due');
export const getUpcomingInstallments = () => client.get('/student/payments/upcoming');
