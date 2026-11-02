import client from './customerAxiosClient.js';

export const getHomeServices = (params) => client.get('/customer/home-services', { params });
export const getHomeServiceById = (id) => client.get(`/customer/home-services/${id}`);
export const getHomeServiceTracking = (id) => client.get(`/customer/home-services/${id}/tracking`);
export const getHomeServiceLocation = (id) => client.get(`/customer/home-services/${id}/location`);
export const getHomeServiceTimeline = (id) => client.get(`/customer/home-services/${id}/timeline`);
