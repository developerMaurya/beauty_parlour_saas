import client from './customerAxiosClient.js';

export const getFavorites = () => client.get('/customer/favorites');
export const addFavoriteService = (serviceId) => client.post(`/customer/favorites/services/${serviceId}`, {});
export const removeFavoriteService = (serviceId) => client.delete(`/customer/favorites/services/${serviceId}`);
export const addFavoriteStaff = (staffId) => client.post(`/customer/favorites/staff/${staffId}`, {});
export const removeFavoriteStaff = (staffId) => client.delete(`/customer/favorites/staff/${staffId}`);
export const addFavoritePackage = (packageId) => client.post(`/customer/favorites/packages/${packageId}`, {});
export const removeFavoritePackage = (packageId) => client.delete(`/customer/favorites/packages/${packageId}`);
