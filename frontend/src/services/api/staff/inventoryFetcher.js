import client from './staffAxiosClient.js';

export const getInventory = (params) => client.get('/staff/inventory', { params });
export const getAvailability = (params) => client.get('/staff/inventory/availability', { params });
export const createRequest = (data) => client.post('/staff/inventory-requests', data);
export const getRequests = (params) => client.get('/staff/inventory-requests', { params });
export const getRequest = (id) => client.get(`/staff/inventory-requests/${id}`);
export const cancelRequest = (id) => client.post(`/staff/inventory-requests/${id}/cancel`);

export const createInventoryRequest = createRequest;
export const getInventoryRequests = getRequests;
export const getInventoryRequest = getRequest;
export const cancelInventoryRequest = cancelRequest;
