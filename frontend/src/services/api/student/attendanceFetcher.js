import client from './studentAxiosClient.js';

export const getAttendance = (params) => client.get('/student/attendance', { params });
export const getAll = getAttendance;
export const getTodayAttendance = () => client.get('/student/attendance/today');
export const getMonthlyAttendance = (month) => client.get('/student/attendance/monthly', { params: { month } });
export const getAttendanceSummary = (params) => client.get('/student/attendance/summary', { params });
export const getSummary = getAttendanceSummary;
export const getAttendanceById = (id) => client.get(`/student/attendance/${id}`);
export const getById = getAttendanceById;
