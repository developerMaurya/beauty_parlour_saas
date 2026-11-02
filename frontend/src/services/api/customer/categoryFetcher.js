import client from './customerAxiosClient.js';

export const getCategories = (params) => client.get('/customer/service-categories', { params });
export const getCategoryById = (id) => client.get(`/customer/service-categories/${id}`);
export const getServiceCategories = getCategories;
export const getServiceCategoryById = getCategoryById;
