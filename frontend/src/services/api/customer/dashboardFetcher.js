import client from './customerAxiosClient.js';

export const getDashboard = () => client.get('/customer/dashboard');
export const getCustomerDashboard = getDashboard;
