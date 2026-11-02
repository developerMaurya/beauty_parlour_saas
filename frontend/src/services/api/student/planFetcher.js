import client from './studentAxiosClient.js';

export const getPlans = (params) => client.get('/student/plans', { params });
export const getAll = getPlans;
export const getPlanById = (id) => client.get(`/student/plans/${id}`);
export const getById = getPlanById;
export const getPlanFeatures = (id) => client.get(`/student/plans/${id}/features`);
export const getPlanCourses = (id) => client.get(`/student/plans/${id}/courses`);
export const getPlanServices = (id) => client.get(`/student/plans/${id}/services`);
