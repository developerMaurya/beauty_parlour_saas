import client from './staffAxiosClient.js';

export const getReviews = (params) => client.get('/staff/reviews', { params });
export const getReviewById = (id) => client.get(`/staff/reviews/${id}`);
