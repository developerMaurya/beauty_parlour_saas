import client from './publicAxiosClient.js';

export const getOffers = (params) => client.get('/public/offers', { params });
export const getOfferById = (id) => client.get(`/public/offers/${id}`);
