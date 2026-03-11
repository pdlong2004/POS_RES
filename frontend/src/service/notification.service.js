import api from '@/lib/axois';

export const getNotificationsApi = async () => {
    try {
        const response = await api.get('/notifications');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const markAsReadApi = async (id) => {
    try {
        const response = await api.put(`/notifications/${id}/read`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const markAllAsReadApi = async () => {
    try {
        const response = await api.put(`/notifications/mark-all-read`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
