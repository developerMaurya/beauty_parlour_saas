import client from './studentAxiosClient.js';

export const getAttendanceCorrections = (params) => client.get('/student/attendance-corrections', { params });
export const getAll = getAttendanceCorrections;
export const getAttendanceCorrectionById = (id) => client.get(`/student/attendance-corrections/${id}`);
export const getById = getAttendanceCorrectionById;
export const createAttendanceCorrection = (data) => client.post('/student/attendance-corrections', data);
export const create = createAttendanceCorrection;
export const updateAttendanceCorrection = (id, data) => client.put(`/student/attendance-corrections/${id}`, data);
export const update = updateAttendanceCorrection;
export const deleteAttendanceCorrection = (id) => client.delete(`/student/attendance-corrections/${id}`);
export { deleteAttendanceCorrection as delete };
export const cancelAttendanceCorrection = (id) => client.post(`/student/attendance-corrections/${id}/cancel`);
export const cancel = cancelAttendanceCorrection;
