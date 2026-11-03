import client from './customerAxiosClient.js';

export const getDocuments = (params) => client.get('/customer/documents', { params });
export const getDocumentById = (id) => client.get(`/customer/documents/${id}`);
export const uploadDocument = (data) => client.post('/customer/documents', data);
export const updateDocument = (id, data) => client.put(`/customer/documents/${id}`, data);
export const deleteDocument = (id) => client.delete(`/customer/documents/${id}`);
export const downloadDocument = (id) => client.get(`/customer/documents/${id}/download`);
