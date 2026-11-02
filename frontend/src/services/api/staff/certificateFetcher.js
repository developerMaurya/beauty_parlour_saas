import client from './staffAxiosClient.js';

export const getCertificates = () => client.get('/staff/certificates');
export const getCertificate = (id) => client.get(`/staff/certificates/${id}`);
export const downloadCertificate = (id) => client.get(`/staff/certificates/${id}/download`);
export const uploadCertificate = (data) => client.post('/staff/certificates', data);
export const updateCertificate = (id, data) => client.patch(`/staff/certificates/${id}`, data);
export const deleteCertificate = (id) => client.delete(`/staff/certificates/${id}`);

export const createCertificate = uploadCertificate;
