import client from './staffAxiosClient.js';

export const getMyAppointments = (params) => client.get('/staff/appointments', { params });
export const getAppointment = (id) => client.get(`/staff/appointments/${id}`);
export const getTodayAppointments = () => client.get('/staff/appointments/today');
export const getUpcomingAppointments = () => client.get('/staff/appointments/upcoming');
export const getAppointmentHistory = (params) => client.get('/staff/appointments/history', { params });
export const acceptAppointment = (id) => client.post(`/staff/appointments/${id}/accept`);
export const rejectAppointment = (id, reason) => client.post(`/staff/appointments/${id}/reject`, { reason });
export const confirmAppointment = (id) => client.post(`/staff/appointments/${id}/confirm`);
export const checkInAppointment = (id) => client.post(`/staff/appointments/${id}/check-in`);
export const startAppointment = (id) => client.post(`/staff/appointments/${id}/start`);
export const pauseAppointment = (id) => client.post(`/staff/appointments/${id}/pause`);
export const resumeAppointment = (id) => client.post(`/staff/appointments/${id}/resume`);
export const completeAppointment = (id) => client.post(`/staff/appointments/${id}/complete`);
export const cancelAppointmentRequest = (id, reason) => client.post(`/staff/appointments/${id}/cancel-request`, { reason });
export const rescheduleAppointmentRequest = (id, data) => client.post(`/staff/appointments/${id}/reschedule-request`, data);
