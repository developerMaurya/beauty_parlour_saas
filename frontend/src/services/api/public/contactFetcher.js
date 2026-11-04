import client from './publicAxiosClient.js';

export const submitContactInquiry = (data) => client.post('/public/contact', data);
export const getWebsiteDetails = () => client.get('/public/website');
export const getGallery = () => client.get('/public/gallery');
export const getTestimonials = () => client.get('/public/testimonials');
export const getFaqs = () => client.get('/public/faqs');

