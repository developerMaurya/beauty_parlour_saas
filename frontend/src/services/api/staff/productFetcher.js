import client from './staffAxiosClient.js';

export const getProducts = (params) => client.get('/staff/products', { params });
export const getProduct = (id) => client.get(`/staff/products/${id}`);
