import client from './customerAxiosClient.js';

export const getAppointmentTracking = (id) => client.get(`/customer/appointments/${id}/tracking`);
export const getAppointmentStatus = (id) => client.get(`/customer/appointments/${id}/status`);
export const getAppointmentTimeline = (id) => client.get(`/customer/appointments/${id}/timeline`);
