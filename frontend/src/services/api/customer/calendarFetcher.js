import client from './customerAxiosClient.js';

export const getCalendar = (params) => client.get('/customer/calendar', { params });
export const getTodayCalendar = () => client.get('/customer/calendar/today');
export const getWeekCalendar = () => client.get('/customer/calendar/week');
export const getMonthCalendar = () => client.get('/customer/calendar/month');
