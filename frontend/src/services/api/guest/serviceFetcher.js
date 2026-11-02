import client from './guestAxiosClient.js';

export const getServices = (params) => client.get('/guest/services', { params });
export const getServiceById = (id) => client.get(`/guest/services/${id}`);
