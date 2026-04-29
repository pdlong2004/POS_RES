import api from '../lib/axois.js';

export const getSuppliersApi = async () => {
    try {
        const response = await api.get('/suppliers');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createSupplierApi = async (data) => {
    try {
        const response = await api.post('/suppliers', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateSupplierApi = async (id, data) => {
    try {
        const response = await api.put(`/suppliers/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteSupplierApi = async (id) => {
    try {
        const response = await api.delete(`/suppliers/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
