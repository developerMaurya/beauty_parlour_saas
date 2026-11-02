import client from './studentAxiosClient.js';

export const getChats = (params) => client.get('/student/chats', { params });
export const getAll = getChats;
export const getChatById = (id) => client.get(`/student/chats/${id}`);
export const getById = getChatById;
export const createChat = (data) => client.post('/student/chats', data);
export const create = createChat;
export const getChatMessages = (id) => client.get(`/student/chats/${id}/messages`);
export const getMessages = getChatMessages;
export const sendMessage = (id, data) => client.post(`/student/chats/${id}/messages`, data);
export const markChatRead = (id) => client.put(`/student/chats/${id}/read`);
export const read = markChatRead;
export const archiveChat = (id) => client.post(`/student/chats/${id}/archive`);
export const archive = archiveChat;
