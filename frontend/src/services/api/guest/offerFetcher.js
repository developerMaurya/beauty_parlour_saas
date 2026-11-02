import client from './guestAxiosClient.js';

export const getOffers = (params) => client.get('/guest/offers', { params });
export const getOfferById = (id) => client.get(`/guest/offers/${id}`);
