import client from './customerAxiosClient.js';

export const getCoupons = (params) => client.get('/customer/coupons', { params });
export const validateCoupon = (data) => client.post('/customer/coupons/validate', data);
