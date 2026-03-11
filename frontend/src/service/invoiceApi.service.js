import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/invoices';

export const invoiceService = {
    getInvoices: async (params = {}) => {
        try {
            const response = await axios.get(API_BASE_URL, { params });
            return response.data;
        } catch (error) {
            console.error('Get invoices error:', error);
            throw error;
        }
    },

    getInvoiceById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Get invoice by ID error:', error);
            throw error;
        }
    },

    createInvoice: async (data) => {
        try {
            const response = await axios.post(API_BASE_URL, data);
            return response.data;
        } catch (error) {
            console.error('Create invoice error:', error);
            throw error;
        }
    },

    updateInvoice: async (id, data) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Update invoice error:', error);
            throw error;
        }
    },

    payInvoice: async (id, data) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}/pay`, data);
            return response.data;
        } catch (error) {
            console.error('Pay invoice error:', error);
            throw error;
        }
    },

    getRevenue: async (params = {}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/revenue`, { params });
            return response.data;
        } catch (error) {
            console.error('Get revenue error:', error);
            throw error;
        }
    },

    getAllInvoices: async (params = {}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/all`, { params });
            return response.data;
        } catch (error) {
            console.error('Get all invoices error:', error);
            throw error;
        }
    },
};

export default invoiceService;
