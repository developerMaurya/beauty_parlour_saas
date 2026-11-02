import client from './studentAxiosClient.js';

export const getExams = (params) => client.get('/student/exams', { params });
export const getExamById = (id) => client.get(`/student/exams/${id}`);
export const getExamResult = (id) => client.get(`/student/exams/${id}/result`);
