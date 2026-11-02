import client from './studentAxiosClient.js';

export const getTests = (params) => client.get('/student/tests', { params });
export const getAll = getTests;
export const getTestById = (id) => client.get(`/student/tests/${id}`);
export const getById = getTestById;
export const startTest = (id) => client.post(`/student/tests/${id}/start`);
export const submitTest = (id, data) => client.post(`/student/tests/${id}/submit`, data);
export const submit = submitTest;
export const getTestResult = (id) => client.get(`/student/tests/${id}/result`);
export const getResult = getTestResult;

export const getAllExams = (params) => client.get('/student/exams', { params });
export const getExamById = (id) => client.get(`/student/exams/${id}`);
export const getExamResult = (id) => client.get(`/student/exams/${id}/result`);
