import client from './staffAxiosClient.js';

export const getDayView = (date) => client.get('/staff/calendar/day', { params: { date } });
export const getWeekView = (startDate) => client.get('/staff/calendar/week', { params: { startDate } });
export const getMonthView = (params) => client.get('/staff/calendar/month', { params });

export const getDayCalendar = (params) => client.get('/staff/calendar/day', { params });
export const getWeekCalendar = (params) => client.get('/staff/calendar/week', { params });
export const getMonthCalendar = (params) => client.get('/staff/calendar/month', { params });
