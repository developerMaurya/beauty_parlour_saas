import client from './studentAxiosClient.js';

export const getCalendar = (params) => client.get('/student/calendar', { params });
export const getEvents = getCalendar;
export const getAll = getCalendar;
