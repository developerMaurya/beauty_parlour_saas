import client from './guestAxiosClient.js';

export const getStaff = (params) => client.get('/guest/staff', { params });
export const getStaffById = (id) => client.get(`/guest/staff/${id}`);
