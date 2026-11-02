import client from './staffAxiosClient.js';

export const getOverview = () => client.get('/staff/earnings');
export const getSummary = () => client.get('/staff/earnings/summary');
export const getMonthly = (params) => client.get('/staff/earnings/monthly', { params });
export const getCommissionEarnings = () => client.get('/staff/earnings/commission');
export const getHistory = (params) => client.get('/staff/earnings/history', { params });

export const getEarningsOverview = getOverview;
export const getEarningsSummary = getSummary;
export const getMonthlyEarnings = getMonthly;
export const getEarningsHistory = getHistory;
