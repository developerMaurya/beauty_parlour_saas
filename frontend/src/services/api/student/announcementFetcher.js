import client from './studentAxiosClient.js';

export const getAnnouncements = (params) => client.get('/student/announcements', { params });
export const getAll = getAnnouncements;
export const getAnnouncementById = (id) => client.get(`/student/announcements/${id}`);
export const getById = getAnnouncementById;
export const markAnnouncementRead = (id) => client.put(`/student/announcements/${id}/read`);
export const read = markAnnouncementRead;
