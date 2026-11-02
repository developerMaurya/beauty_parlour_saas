import client from './studentAxiosClient.js';

export const getProgress = (params) => client.get('/student/progress', { params });
export const getAll = getProgress;
export const getProgressSummary = (params) => client.get('/student/progress/summary', { params });
export const getSummary = getProgressSummary;
export const getProgressHistory = (params) => client.get('/student/progress/history', { params });
export const getHistory = getProgressHistory;
export const getCourseProgress = (courseId) => client.get(`/student/progress/course/${courseId}`);
export const getByCourse = getCourseProgress;
export const getModuleProgress = (moduleId) => client.get(`/student/progress/module/${moduleId}`);
export const getByModule = getModuleProgress;
