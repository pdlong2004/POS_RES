import api from '../lib/axois.js';

export const postBookingApi = (data) => {
    return api.post('/bookings', data);
};

export const getBookingsApi = () => {
    return api.get('/bookings');
};

export const getBookingByIdApi = (id) => {
    return api.get(`/bookings/${id}`);
};

export const updateBookingApi = (id, data) => {
    return api.put(`/bookings/${id}`, data);
};

export const cancelBookingApi = (id) => {
    return api.delete(`/bookings/${id}`);
};
