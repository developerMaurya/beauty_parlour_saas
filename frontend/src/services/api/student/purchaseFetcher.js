import client from './studentAxiosClient.js';

export const createPurchase = (data) => client.post('/student/purchases', data);
export const create = createPurchase;
export const getPurchases = (params) => client.get('/student/purchases', { params });
export const getAll = getPurchases;
export const getPurchaseById = (id) => client.get(`/student/purchases/${id}`);
export const getById = getPurchaseById;
export const cancelPurchase = (id) => client.post(`/student/purchases/${id}/cancel`);
export const cancel = cancelPurchase;
