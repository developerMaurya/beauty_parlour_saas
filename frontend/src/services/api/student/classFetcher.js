import client from './studentAxiosClient.js';

export const getClasses = (params) => client.get('/student/classes', { params });
export const getClassById = (id) => client.get(`/student/classes/${id}`);
