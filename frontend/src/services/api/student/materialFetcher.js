import client from './studentAxiosClient.js';

export const getMaterials = (params) => client.get('/student/materials', { params });
export const getAll = getMaterials;
export const getMaterialById = (id) => client.get(`/student/materials/${id}`);
export const getById = getMaterialById;
export const downloadMaterial = (id) => client.get(`/student/materials/${id}/download`);
export const download = downloadMaterial;
