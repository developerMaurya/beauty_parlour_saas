import client from './staffAxiosClient.js';

export const getCommission = (params) => client.get('/staff/commission', { params });
export const getSummary = () => client.get('/staff/commission/summary');
export const getHistory = (params) => client.get('/staff/commission/history', { params });

export const getCommissionSummary = getSummary;
export const getCommissionHistory = getHistory;
