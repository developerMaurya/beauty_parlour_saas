import client from './staffAxiosClient.js';

export const getRole = () => client.get('/staff/role');
