import client from './guestAxiosClient.js';

export const createGuestBooking = (data) => client.post('/guest/book', data);
export const bookAsGuest = createGuestBooking;
