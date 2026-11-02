import client from './staffAxiosClient.js';

export const getAnnouncements = () => client.get('/staff/announcements');
export const getAnnouncement = (id) => client.get(`/staff/announcements/${id}`);
export const markAsRead = (id) => client.patch(`/staff/announcements/${id}/read`);
