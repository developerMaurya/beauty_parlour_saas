import client from './staffAxiosClient.js';

export const getOverview = () => client.get('/staff/dashboard/overview');
export const getToday = () => client.get('/staff/dashboard/today');
export const getAppointments = () => client.get('/staff/dashboard/appointments');
export const getTasks = () => client.get('/staff/dashboard/tasks');
export const getCustomers = () => client.get('/staff/dashboard/customers');
export const getHomeServices = () => client.get('/staff/dashboard/home-services');
export const getEarnings = () => client.get('/staff/dashboard/earnings');
export const getAttendance = () => client.get('/staff/dashboard/attendance');
export const getNotifications = () => client.get('/staff/dashboard/notifications');
export const getUpcoming = () => client.get('/staff/dashboard/upcoming');
export const getBirthdays = () => client.get('/staff/dashboard/birthdays');
export const getLeaves = () => client.get('/staff/dashboard/leaves');
export const getPendingRequests = () => client.get('/staff/dashboard/pending-requests');
