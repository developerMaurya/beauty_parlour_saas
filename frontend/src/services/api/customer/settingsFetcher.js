import client from './customerAxiosClient.js';

export const getSettings = () => client.get('/customer/settings');
export const updateSettings = (data) => client.put('/customer/settings', data);
