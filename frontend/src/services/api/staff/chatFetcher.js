import client from './staffAxiosClient.js';

export const createChat = (data) => client.post('/staff/chats', data);
export const getChats = () => client.get('/staff/chats');
export const getChat = (id) => client.get(`/staff/chats/${id}`);
export const sendMessage = (id, data) => client.post(`/staff/chats/${id}/messages`, data);
export const getMessages = (id, params) => client.get(`/staff/chats/${id}/messages`, { params });
export const markAsRead = (id) => client.patch(`/staff/chats/${id}/read`);
export const archiveChat = (id) => client.post(`/staff/chats/${id}/archive`);
