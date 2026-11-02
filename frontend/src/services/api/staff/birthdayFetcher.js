import client from './staffAxiosClient.js';

export const getBirthdays = () => client.get('/staff/birthdays');
export const getUpcomingBirthdays = () => client.get('/staff/birthdays/upcoming');
