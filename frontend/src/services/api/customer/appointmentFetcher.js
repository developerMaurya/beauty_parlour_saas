import client from './customerAxiosClient.js';

export const createAppointment = (data) => client.post('/customer/appointments', data);
export const getAppointments = (params) => client.get('/customer/appointments', { params });
export const getUpcomingAppointments = () => client.get('/customer/appointments/upcoming');
export const getTodayAppointments = () => client.get('/customer/appointments/today');
export const getCompletedAppointments = () => client.get('/customer/appointments/completed');
export const getCancelledAppointments = () => client.get('/customer/appointments/cancelled');
export const getAppointmentHistory = (params) => client.get('/customer/appointments/history', { params });
export const getAppointmentById = (id) => client.get(`/customer/appointments/${id}`);
export const updateAppointment = (id, data) => client.put(`/customer/appointments/${id}`, data);
export const patchAppointment = (id, data) => client.patch(`/customer/appointments/${id}`, data);
export const cancelAppointment = (id, data) => client.post(`/customer/appointments/${id}/cancel`, data);
export const rescheduleAppointment = (id, data) => client.post(`/customer/appointments/${id}/reschedule`, data);
export const getRescheduleOptions = (id) => client.get(`/customer/appointments/${id}/reschedule-options`);
export const confirmAppointment = (id) => client.post(`/customer/appointments/${id}/confirm`, {});
export const rebookAppointment = (id, data) => client.post(`/customer/appointments/${id}/rebook`, data);
