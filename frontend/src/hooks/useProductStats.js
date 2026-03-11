import { useEffect } from 'react';
import { useState } from 'react';
import { getProductsStatApi } from '@/service/products.service';

export const useProductStats = () => {
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getProductsStatApi();
                setTotalProducts(res.data.totalProducts);
            } catch (error) {
                console.error('Fetch product stats error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { totalProducts, loading };
};
