import client from './customerAxiosClient.js';

export const getAddresses = () => client.get('/customer/addresses');
export const createAddress = (data) => client.post('/customer/addresses', data);
export const getAddressById = (id) => client.get(`/customer/addresses/${id}`);
export const updateAddress = (id, data) => client.put(`/customer/addresses/${id}`, data);
export const deleteAddress = (id) => client.delete(`/customer/addresses/${id}`);
export const setDefaultAddress = (id) => client.post(`/customer/addresses/${id}/default`, {});
