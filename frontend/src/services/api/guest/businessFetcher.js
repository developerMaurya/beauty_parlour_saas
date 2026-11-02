import client from './guestAxiosClient.js';

export const getBusinessInfo = () => client.get('/guest/business');
export const getWorkingHours = (params) => client.get('/guest/working-hours', { params });
