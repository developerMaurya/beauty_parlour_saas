import client from './studentAxiosClient.js';

export const getProfile = () => client.get('/student/profile');
export const updateProfile = (data) => client.put('/student/profile', data);
export const patchProfile = (data) => client.patch('/student/profile', data);
export const uploadPhoto = (photoUrl) => client.post('/student/profile/photo', { photoUrl });
export const deletePhoto = () => client.delete('/student/profile/photo');
