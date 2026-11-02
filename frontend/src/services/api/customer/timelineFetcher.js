import client from './customerAxiosClient.js';

export const getTimeline = (params) => client.get('/customer/timeline', { params });
