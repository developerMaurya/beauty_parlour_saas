import client from './studentAxiosClient.js';

export const getCertificates = (params) => client.get('/student/certificates', { params });
export const getAll = getCertificates;
export const getCertificateById = (id) => client.get(`/student/certificates/${id}`);
export const getById = getCertificateById;
export const getCertificateStatus = (id) => client.get(`/student/certificates/${id}/status`);
export const downloadCertificate = (id) => client.get(`/student/certificates/${id}/download`);
export const verifyCertificate = (id) => client.get(`/student/certificates/${id}/verify`);
