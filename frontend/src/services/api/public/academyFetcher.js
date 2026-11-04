import client from './publicAxiosClient.js';

export const getAcademyCourses = () => client.get('/public/academy');

