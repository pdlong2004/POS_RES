import api from '../lib/axois.js';

export const createOrderApi = (tableId, items) => {
    return api.post('/orders', {
        tableId,
        items: items.map((i) => ({
            productId: i.product._id,
            quantity: i.quantity,
            price: i.product.price,
        })),
    });
};

export const getTotalOrders = () => {
    return api.get('/orders/total');
};

export const getOrders = async (params = {}) => {
    const res = await api.get('/orders', { params });
    // backend returns { success: true, data: [...] }
    return res.data?.data ?? [];
};

export const getOrderById = async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data?.data ?? null;
};

export const updateOrdersStatus = async (orderIds, status) => {
    const res = await api.put('/orders/status', { orderIds, status });
    return res.data;
};
