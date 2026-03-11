import axios from 'axios';

const API_URL = 'http://localhost:5001/api/suppliers';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    };
};

export const getSuppliersApi = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createSupplierApi = async (data) => {
    try {
        const response = await axios.post(API_URL, data, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateSupplierApi = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteSupplierApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
