import client from './customerAxiosClient.js';

export const createReview = (data) => client.post('/customer/reviews', data);
export const getReviews = (params) => client.get('/customer/reviews', { params });
export const getReviewById = (id) => client.get(`/customer/reviews/${id}`);
export const updateReview = (id, data) => client.put(`/customer/reviews/${id}`, data);
export const deleteReview = (id) => client.delete(`/customer/reviews/${id}`);
