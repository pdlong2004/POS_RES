import axios from 'axios';

const API_URL = 'http://localhost:5001/api/imports';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    };
};

export const getImportsApi = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getImportDetailsApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createImportApi = async (data) => {
    try {
        const response = await axios.post(API_URL, data, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
