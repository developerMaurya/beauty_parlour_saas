import client from './guestAxiosClient.js';

export const getAvailability = (params) => client.get('/guest/availability', { params });
export const checkSlotAvailability = (params) => client.get('/guest/availability/check', { params });
