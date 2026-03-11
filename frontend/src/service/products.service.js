import api from '../lib/axois.js';

export const getProductsApi = () => {
    return api.get('/products');
};

export const getProductsByCategoryApi = (slug) => {
    return api.get(`/products/category/${slug}`);
};

export const getProductsStatApi = () => {
    return api.get(`/products/stats`);
};

export const createProductApi = (data) => {
    return api.post('/products', data);
};

export const updateProductApi = (id, data) => {
    return api.put(`/products/${id}`, data);
};

export const deleteProductApi = (id) => {
    return api.delete(`/products/${id}`);
};
