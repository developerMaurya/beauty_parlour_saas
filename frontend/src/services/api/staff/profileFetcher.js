import client from './staffAxiosClient.js';

export const getProfile = () => client.get('/staff/profile');
export const updateProfile = (data) => client.patch('/staff/profile', data);
export const uploadPhoto = (formData) => client.post('/staff/profile/photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deletePhoto = () => client.delete('/staff/profile/photo');
export const getSummary = () => client.get('/staff/profile/summary');
export const getActivity = () => client.get('/staff/profile/activity');

export const getProfileSummary = getSummary;
