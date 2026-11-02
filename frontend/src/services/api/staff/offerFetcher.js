import client from './staffAxiosClient.js';

export const getOffers = (params) => client.get('/staff/offers', { params });
export const getOffer = (id) => client.get(`/staff/offers/${id}`);
