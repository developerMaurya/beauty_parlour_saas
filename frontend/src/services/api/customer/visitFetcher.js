import client from './customerAxiosClient.js';

export const getVisits = (params) => client.get('/customer/visits', { params });
export const getVisitById = (id) => client.get(`/customer/visits/${id}`);
