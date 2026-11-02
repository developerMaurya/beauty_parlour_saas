import client from './staffAxiosClient.js';

export const checkIn = (data) => client.post('/staff/attendance/check-in', data);
export const checkOut = (data) => client.post('/staff/attendance/check-out', data);
export const getAttendance = (params) => client.get('/staff/attendance', { params });
export const getTodayAttendance = () => client.get('/staff/attendance/today');
export const getAttendanceById = (id) => client.get(`/staff/attendance/${id}`);
export const getSummary = () => client.get('/staff/attendance/summary');
export const getMonthly = (params) => client.get('/staff/attendance/monthly', { params });

export const getAttendanceRecords = getAttendance;
export const getAttendanceSummary = getSummary;
export const getMonthlyAttendance = getMonthly;
