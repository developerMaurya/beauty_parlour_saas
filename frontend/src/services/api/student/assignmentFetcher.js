import client from './studentAxiosClient.js';

export const getAssignments = (params) => client.get('/student/assignments', { params });
export const getAll = getAssignments;
export const getAssignmentById = (id) => client.get(`/student/assignments/${id}`);
export const getById = getAssignmentById;
export const submitAssignment = (id, data) => client.post(`/student/assignments/${id}/submit`, data);
export const submit = submitAssignment;
export const updateSubmission = (id, data) => client.put(`/student/assignments/${id}/submission`, data);
export const getAssignmentResult = (id) => client.get(`/student/assignments/${id}/result`);
export const getResult = getAssignmentResult;
