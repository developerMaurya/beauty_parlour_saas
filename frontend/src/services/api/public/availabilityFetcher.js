import client from './publicAxiosClient.js';

export const getPublicAvailability = (params) => client.get('/public/availability', { params });
export const checkSlotAvailability = (params) => client.get('/public/availability/check', { params });
export const getAvailability = getPublicAvailability;
