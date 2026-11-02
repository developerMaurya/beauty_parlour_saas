import client from './publicAxiosClient.js';

export const getPublicStaff = (params) => client.get('/public/staff', { params });
export const getPublicStaffById = (id) => client.get(`/public/staff/${id}`);
export const getStaff = getPublicStaff;
export const getStaffById = getPublicStaffById;
