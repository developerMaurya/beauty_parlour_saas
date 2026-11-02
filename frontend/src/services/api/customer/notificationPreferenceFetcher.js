import client from './customerAxiosClient.js';

export const getNotificationPreferences = () => client.get('/customer/settings/notifications');
export const updateNotificationPreferences = (data) => client.put('/customer/settings/notifications', data);
