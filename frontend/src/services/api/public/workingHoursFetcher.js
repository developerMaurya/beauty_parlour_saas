import client from './publicAxiosClient.js';

export const getWorkingHours = (params) => client.get('/public/working-hours', { params });
export const getBranchWorkingHours = (branchId) => client.get(`/public/branches/${branchId}/working-hours`);
