import client from './publicAxiosClient.js';

export const getBusinessInfo = () => client.get('/public/business');
export const getHolidays = (params) => client.get('/public/holidays', { params });
