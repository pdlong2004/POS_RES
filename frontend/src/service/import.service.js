import api from '../lib/axois.js';

export const getImportsApi = async () => {
    try {
        const response = await api.get('/imports');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getImportDetailsApi = async (id) => {
    try {
        const response = await api.get(`/imports/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createImportApi = async (data) => {
    try {
        const response = await api.post('/imports', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
