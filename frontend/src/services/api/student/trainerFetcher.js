import client from './studentAxiosClient.js';

export const getTrainers = (params) => client.get('/student/trainers', { params });
export const getAll = getTrainers;
export const getTrainerById = (id) => client.get(`/student/trainers/${id}`);
export const getById = getTrainerById;
export const getTrainerProfile = (id) => client.get(`/student/trainers/${id}/profile`);
export const getProfile = getTrainerProfile;
