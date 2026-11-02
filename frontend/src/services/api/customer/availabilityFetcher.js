import client from './customerAxiosClient.js';

export const getAvailability = (params) => client.get('/customer/availability', { params });
export const checkSlotAvailability = (params) => client.get('/customer/availability/check', { params });
export const getWorkingHours = (params) => client.get('/customer/working-hours', { params });
