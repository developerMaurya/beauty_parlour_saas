import client from './guestAxiosClient.js';

export const getPackages = (params) => client.get('/guest/packages', { params });
export const getPackageById = (id) => client.get(`/guest/packages/${id}`);
