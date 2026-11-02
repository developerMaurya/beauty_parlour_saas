import client from './customerAxiosClient.js';

export const getOffers = (params) => client.get('/customer/offers', { params });
export const getOfferById = (id) => client.get(`/customer/offers/${id}`);
