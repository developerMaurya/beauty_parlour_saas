import client from './studentAxiosClient.js';

export const getTimeline = (params) => client.get('/student/timeline', { params });
export const getEvents = getTimeline;
export const getAll = getTimeline;
