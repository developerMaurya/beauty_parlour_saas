import client from './studentAxiosClient.js';

export const getDocuments = (params) => client.get('/student/documents', { params });
export const getAll = getDocuments;
export const getDocumentById = (id) => client.get(`/student/documents/${id}`);
export const getById = getDocumentById;
export const uploadDocument = (data) => client.post('/student/documents', data);
export const upload = uploadDocument;
export const updateDocument = (id, data) => client.put(`/student/documents/${id}`, data);
export const update = updateDocument;
export const deleteDocument = (id) => client.delete(`/student/documents/${id}`);
export { deleteDocument as delete };
export const downloadDocument = (id) => client.get(`/student/documents/${id}/download`);
export const download = downloadDocument;
