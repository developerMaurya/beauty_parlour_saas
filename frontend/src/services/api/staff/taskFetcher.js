import client from './staffAxiosClient.js';

export const getTasks = (params) => client.get('/staff/tasks', { params });
export const getTask = (id) => client.get(`/staff/tasks/${id}`);
export const acceptTask = (id) => client.post(`/staff/tasks/${id}/accept`);
export const startTask = (id) => client.post(`/staff/tasks/${id}/start`);
export const pauseTask = (id) => client.post(`/staff/tasks/${id}/pause`);
export const completeTask = (id) => client.post(`/staff/tasks/${id}/complete`);
export const rejectTask = (id) => client.post(`/staff/tasks/${id}/reject`);
export const getTaskComments = (id) => client.get(`/staff/tasks/${id}/comments`);
export const addTaskComment = (id, data) => client.post(`/staff/tasks/${id}/comments`, data);
export const updateTaskComment = (id, commentId, data) => client.patch(`/staff/tasks/${id}/comments/${commentId}`, data);
export const deleteTaskComment = (id, commentId) => client.delete(`/staff/tasks/${id}/comments/${commentId}`);
