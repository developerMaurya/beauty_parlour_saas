import client from './staffAxiosClient.js';

export const applyLeave = (data) => client.post('/staff/leaves', data);
export const getLeaves = (params) => client.get('/staff/leaves', { params });
export const getLeaveById = (id) => client.get(`/staff/leaves/${id}`);
export const updateLeave = (id, data) => client.patch(`/staff/leaves/${id}`, data);
export const deleteLeave = (id) => client.delete(`/staff/leaves/${id}`);
export const cancelLeave = (id) => client.post(`/staff/leaves/${id}/cancel`);
