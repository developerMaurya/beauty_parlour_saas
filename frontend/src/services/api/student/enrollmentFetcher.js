import client from './studentAxiosClient.js';

export const getEnrollments = (params) => client.get('/student/enrollments', { params });
export const getAll = getEnrollments;
export const getEnrollmentById = (id) => client.get(`/student/enrollments/${id}`);
export const getById = getEnrollmentById;
export const getEnrollmentOverview = (id) => client.get(`/student/enrollments/${id}/overview`);
export const getOverview = getEnrollmentOverview;
export const getEnrollmentTimeline = (id) => client.get(`/student/enrollments/${id}/timeline`);
export const getTimeline = getEnrollmentTimeline;
export const getEnrollmentStatus = (id) => client.get(`/student/enrollments/${id}/status`);
export const getStatus = getEnrollmentStatus;
