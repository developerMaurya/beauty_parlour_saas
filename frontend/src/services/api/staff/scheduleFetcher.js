import client from './staffAxiosClient.js';

export const getSchedule = () => client.get('/staff/schedule');
export const getTodaySchedule = () => client.get('/staff/schedule/today');
export const getWeekSchedule = () => client.get('/staff/schedule/week');
export const getWorkingHours = () => client.get('/staff/working-hours');
