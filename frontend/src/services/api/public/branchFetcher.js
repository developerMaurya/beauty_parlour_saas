import client from './publicAxiosClient.js';

export const getBranches = (params) => client.get('/public/branches', { params });
export const getBranchById = (id) => client.get(`/public/branches/${id}`);
