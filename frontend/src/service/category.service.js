import api from '../lib/axois.js';

export const getCategoryApi = () => {
    return api.get('/category');
};

export const createCategoryApi = (data) => {
    return api.post('/category', data);
};

export const updateCategoryApi = (id, data) => {
    return api.put(`/category/${id}`, data);
};

export const deleteCategoryApi = (id) => {
    return api.delete(`/category/${id}`);
};
