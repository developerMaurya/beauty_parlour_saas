import client from './staffAxiosClient.js';

export const getDocuments = (params) => client.get('/staff/documents', { params });
export const getDocument = (id) => client.get(`/staff/documents/${id}`);
export const uploadDocument = (data) => client.post('/staff/documents', data);
export const updateDocument = (id, data) => client.patch(`/staff/documents/${id}`, data);
export const deleteDocument = (id) => client.delete(`/staff/documents/${id}`);

export const createDocument = uploadDocument;
