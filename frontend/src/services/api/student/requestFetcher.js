import client from './studentAxiosClient.js';

export const getRequests = (params) => client.get('/student/requests', { params });
export const getAll = getRequests;
export const getRequestById = (id) => client.get(`/student/requests/${id}`);
export const getById = getRequestById;
export const createRequest = (data) => client.post('/student/requests', data);
export const create = createRequest;
export const updateRequest = (id, data) => client.put(`/student/requests/${id}`, data);
export const update = updateRequest;
export const deleteRequest = (id) => client.delete(`/student/requests/${id}`);
export { deleteRequest as delete };
export const cancelRequest = (id) => client.post(`/student/requests/${id}/cancel`);
export const cancel = cancelRequest;
