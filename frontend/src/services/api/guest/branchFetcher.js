import client from './guestAxiosClient.js';

export const getBranches = (params) => client.get('/guest/branches', { params });
export const getBranchById = (id) => client.get(`/guest/branches/${id}`);
