import client from './studentAxiosClient.js';

export const getServices = (params) => client.get('/student/services', { params });
export const getAll = getServices;
export const getServiceById = (id) => client.get(`/student/services/${id}`);
export const getById = getServiceById;
export const getServiceCategories = () => client.get('/student/services/categories');
export const getCategories = getServiceCategories;
