import client from './studentAxiosClient.js';

export const getCourses = (params) => client.get('/student/courses', { params });
export const getAll = getCourses;
export const getCourseById = (id) => client.get(`/student/courses/${id}`);
export const getById = getCourseById;
export const getCourseModules = (id) => client.get(`/student/courses/${id}/modules`);
export const getModules = getCourseModules;
export const getCourseTopics = (id) => client.get(`/student/courses/${id}/topics`);
export const getTopics = getCourseTopics;
export const getCourseTrainers = (id) => client.get(`/student/courses/${id}/trainers`);
export const getTrainers = getCourseTrainers;
export const getCourseSchedule = (id) => client.get(`/student/courses/${id}/schedule`);
export const getSchedule = getCourseSchedule;
