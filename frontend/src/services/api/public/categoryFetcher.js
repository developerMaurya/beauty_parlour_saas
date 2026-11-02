import client from './publicAxiosClient.js';

export const getServiceCategories = (params) => client.get('/public/service-categories', { params });
export const getServiceCategoryById = (id) => client.get(`/public/service-categories/${id}`);
