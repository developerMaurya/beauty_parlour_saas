import client from './staffAxiosClient.js';

export const getHolidays = () => client.get('/staff/holidays');
export const getUpcomingHolidays = () => client.get('/staff/holidays/upcoming');
export const getHolidayById = (id) => client.get(`/staff/holidays/${id}`);
