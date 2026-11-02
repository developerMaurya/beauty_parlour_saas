import client from './staffAxiosClient.js';

export const getServices = (params) => client.get('/staff/services', { params });
export const getService = (id) => client.get(`/staff/services/${id}`);
export const getCategories = () => client.get('/staff/services/categories');
export const getOptions = () => client.get('/staff/services/options');
export const getSkills = () => client.get('/staff/skills');
export const getSpecializations = () => client.get('/staff/specializations');
export const createSkillRequest = (data) => client.post('/staff/skill-requests', data);
export const getSkillRequests = (params) => client.get('/staff/skill-requests', { params });
export const getSkillRequest = (id) => client.get(`/staff/skill-requests/${id}`);
export const cancelSkillRequest = (id) => client.post(`/staff/skill-requests/${id}/cancel`);
