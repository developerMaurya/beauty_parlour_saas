import client from './studentAxiosClient.js';

export const getOverviewReport = (params) => client.get('/student/reports/overview', { params });
export const getOverview = getOverviewReport;
export const getCourseReport = (params) => client.get('/student/reports/course', { params });
export const getAttendanceReport = (params) => client.get('/student/reports/attendance', { params });
export const getProgressReport = (params) => client.get('/student/reports/progress', { params });
export const getPaymentReport = (params) => client.get('/student/reports/payment', { params });
export const getAssignmentReport = (params) => client.get('/student/reports/assignment', { params });
export const getTestReport = (params) => client.get('/student/reports/test', { params });
export const getExamReport = (params) => client.get('/student/reports/exam', { params });
export const getCertificateReport = (params) => client.get('/student/reports/certificate', { params });
export const getTimelineReport = (params) => client.get('/student/reports/timeline', { params });
export const getCompleteReport = (params) => client.get('/student/reports/complete', { params });
export const getComplete = getCompleteReport;
