import client from './staffAxiosClient.js';

export const getSalary = () => client.get('/staff/salary');
export const getSalaryHistory = () => client.get('/staff/salary/history');
export const getPayslips = (params) => client.get('/staff/payslips', { params });
export const getPayslip = (id) => client.get(`/staff/payslips/${id}`);
export const downloadPayslip = (id) => client.get(`/staff/payslips/${id}/download`);
