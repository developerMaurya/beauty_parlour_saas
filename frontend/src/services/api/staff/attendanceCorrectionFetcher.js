import client from './staffAxiosClient.js';

export const createCorrection = (data) => client.post('/staff/attendance-corrections', data);
export const getCorrections = (params) => client.get('/staff/attendance-corrections', { params });
export const getCorrectionById = (id) => client.get(`/staff/attendance-corrections/${id}`);
export const updateCorrection = (id, data) => client.patch(`/staff/attendance-corrections/${id}`, data);
export const cancelCorrection = (id) => client.post(`/staff/attendance-corrections/${id}/cancel`);

export const createCorrectionRequest = createCorrection;
export const getCorrectionRequests = getCorrections;
export const getCorrectionRequestById = getCorrectionById;
export const cancelCorrectionRequest = cancelCorrection;
