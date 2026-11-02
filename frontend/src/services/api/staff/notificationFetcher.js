import client from './staffAxiosClient.js';

export const getNotifications = (params) => client.get('/staff/notifications', { params });
export const getNotification = (id) => client.get(`/staff/notifications/${id}`);
export const markAsRead = (id) => client.patch(`/staff/notifications/${id}/read`);
export const markAllAsRead = () => client.post('/staff/notifications/read-all');
export const deleteNotification = (id) => client.delete(`/staff/notifications/${id}`);
export const getPreferences = () => client.get('/staff/notification-preferences');
export const updatePreferences = (data) => client.patch('/staff/notification-preferences', data);

export const markNotificationRead = markAsRead;
export const markAllNotificationsRead = markAllAsRead;
