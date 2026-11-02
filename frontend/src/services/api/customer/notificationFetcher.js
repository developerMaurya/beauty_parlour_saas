import client from './customerAxiosClient.js';

export const getNotifications = (params) => client.get('/customer/notifications', { params });
export const getNotificationById = (id) => client.get(`/customer/notifications/${id}`);
export const markNotificationRead = (id) => client.put(`/customer/notifications/${id}/read`, {});
export const markAllNotificationsRead = () => client.post('/customer/notifications/read-all', {});
export const deleteNotification = (id) => client.delete(`/customer/notifications/${id}`);
