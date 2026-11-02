import client from './studentAxiosClient.js';

export const getModules = (params) => client.get('/student/modules', { params });
export const getModuleById = (id) => client.get(`/student/modules/${id}`);
export const getModuleTopics = (id) => client.get(`/student/modules/${id}/topics`);
export const getModuleProgress = (id) => client.get(`/student/modules/${id}/progress`);
