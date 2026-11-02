import client from './studentAxiosClient.js';

export const getNotifications = (params) => client.get('/student/notifications', { params });
export const getAll = getNotifications;
export const getNotificationById = (id) => client.get(`/student/notifications/${id}`);
export const getById = getNotificationById;
export const markNotificationRead = (id) => client.put(`/student/notifications/${id}/read`);
export const read = markNotificationRead;
export const markAllNotificationsRead = () => client.post('/student/notifications/read-all');
export const readAll = markAllNotificationsRead;
export const deleteNotification = (id) => client.delete(`/student/notifications/${id}`);
export const deleteItem = deleteNotification;
export { deleteNotification as delete };
