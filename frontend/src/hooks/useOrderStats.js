import { getTotalOrders } from '@/service/order.service.js';
import { useEffect, useState } from 'react';

export const useOrderStats = () => {
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        const fetchTotalOrders = async () => {
            try {
                const res = await getTotalOrders();
                setTotalOrders(res.data.totalOrders || 0);
            } catch (error) {
                console.error('Failed to fetch total orders:', error);
            }
        };

        fetchTotalOrders();
    }, [totalOrders]);

    return {
        totalOrders,
    };
};
