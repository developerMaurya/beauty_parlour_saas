import client from './staffAxiosClient.js';

export const logUsage = (data) => client.post('/staff/service-usage', data);
export const getUsages = (params) => client.get('/staff/service-usage', { params });
export const getUsage = (id) => client.get(`/staff/service-usage/${id}`);

export const logServiceUsage = logUsage;
export const getServiceUsage = getUsages;
export const getServiceUsageList = getUsages;
export const getServiceUsageById = getUsage;
