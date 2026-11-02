import client from './staffAxiosClient.js';

export const getFeedback = (params) => client.get('/staff/feedback', { params });
export const getFeedbackById = (id) => client.get(`/staff/feedback/${id}`);
