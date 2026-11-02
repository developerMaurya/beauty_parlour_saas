import client from './studentAxiosClient.js';

export const getLeaves = (params) => client.get('/student/leaves', { params });
export const getAll = getLeaves;
export const getLeaveById = (id) => client.get(`/student/leaves/${id}`);
export const getById = getLeaveById;
export const createLeave = (data) => client.post('/student/leaves', data);
export const create = createLeave;
export const updateLeave = (id, data) => client.put(`/student/leaves/${id}`, data);
export const update = updateLeave;
export const deleteLeave = (id) => client.delete(`/student/leaves/${id}`);
export { deleteLeave as delete };
export const cancelLeave = (id) => client.post(`/student/leaves/${id}/cancel`);
export const cancel = cancelLeave;
