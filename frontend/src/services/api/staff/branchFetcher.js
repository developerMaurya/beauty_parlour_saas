import client from './staffAxiosClient.js';

export const getBranches = () => client.get('/staff/branches');
export const getBranchById = (id) => client.get(`/staff/branches/${id}`);
export const getCurrentBranch = () => client.get('/staff/current-branch');
export const switchBranch = (branchId) => client.patch('/staff/current-branch', { branchId });
