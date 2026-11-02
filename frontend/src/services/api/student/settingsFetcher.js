import client from './studentAxiosClient.js';

export const getSettings = () => client.get('/student/settings');
export const get = getSettings;
export const updateSettings = (data) => client.put('/student/settings', data);
export const update = updateSettings;
