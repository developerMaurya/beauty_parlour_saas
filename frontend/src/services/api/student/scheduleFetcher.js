import client from './studentAxiosClient.js';

export const getSchedule = (params) => client.get('/student/schedule', { params });
export const getAll = getSchedule;
export const getTodaySchedule = () => client.get('/student/schedule/today');
export const getToday = getTodaySchedule;
export const getWeekSchedule = () => client.get('/student/schedule/week');
export const getWeek = getWeekSchedule;
export const getMonthSchedule = () => client.get('/student/schedule/month');
export const getMonth = getMonthSchedule;
export const getClasses = (params) => client.get('/student/classes', { params });
export const getClassById = (id) => client.get(`/student/classes/${id}`);
