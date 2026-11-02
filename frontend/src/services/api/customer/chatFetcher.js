import client from './customerAxiosClient.js';

export const getChats = (params) => client.get('/customer/chats', { params });
export const createChat = (data) => client.post('/customer/chats', data);
export const getChatById = (id) => client.get(`/customer/chats/${id}`);
export const getChatMessages = (id, params) => client.get(`/customer/chats/${id}/messages`, { params });
export const sendMessage = (id, data) => client.post(`/customer/chats/${id}/messages`, data);
export const markChatRead = (id) => client.put(`/customer/chats/${id}/read`, {});
export const archiveChat = (id) => client.post(`/customer/chats/${id}/archive`, {});
