import client from './staffAxiosClient.js';

export const getCustomers = (params) => client.get('/staff/customers', { params });
export const getCustomer = (id) => client.get(`/staff/customers/${id}`);
export const getCustomerProfile = (id) => client.get(`/staff/customers/${id}/profile`);
export const getCustomerAppointments = (id) => client.get(`/staff/customers/${id}/appointments`);
export const getCustomerServices = (id) => client.get(`/staff/customers/${id}/services`);
export const getCustomerPackages = (id) => client.get(`/staff/customers/${id}/packages`);
export const getCustomerVisits = (id) => client.get(`/staff/customers/${id}/visits`);
export const getCustomerNotes = (id) => client.get(`/staff/customers/${id}/notes`);
export const getCustomerHistory = (id) => client.get(`/staff/customers/${id}/history`);
export const createCustomer = (data) => client.post('/staff/customers', data);
export const updateCustomer = (id, data) => client.patch(`/staff/customers/${id}`, data);
export const addCustomerNote = (id, data) => client.post(`/staff/customers/${id}/notes`, data);
export const updateCustomerNote = (id, noteId, data) => client.patch(`/staff/customers/${id}/notes/${noteId}`, data);
export const deleteCustomerNote = (id, noteId) => client.delete(`/staff/customers/${id}/notes/${noteId}`);
