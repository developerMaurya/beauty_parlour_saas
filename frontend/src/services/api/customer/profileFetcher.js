import client from './customerAxiosClient.js';

export const getProfile = () => client.get('/customer/profile');
export const updateProfile = (data) => client.put('/customer/profile', data);
export const patchProfile = (data) => client.patch('/customer/profile', data);
export const uploadProfilePhoto = (data) => client.post('/customer/profile/photo', data);
export const deleteProfilePhoto = () => client.delete('/customer/profile/photo');
