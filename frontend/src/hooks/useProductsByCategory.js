import { useEffect, useState } from 'react';
import { getProductsByCategoryApi } from '../service/products.service';
import { socket } from '../socket';

const useProductsByCategory = (slug) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getProductsByCategoryApi(slug);
                setProducts(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    useEffect(() => {
        const handleStockUpdate = (data) => {
            setProducts((prevProducts) => 
                prevProducts.map(p => {
                    if (p._id === data.productId) {
                        // If we have an exact newStock, use it. Otherwise, increment by quantityAdded.
                        const newQuantity = data.newStock !== undefined 
                            ? data.newStock 
                            : (p.stock_quantity + (data.quantityAdded || 0));
                        
                        return { ...p, stock_quantity: newQuantity };
                    }
                    return p;
                })
            );
        };

        socket.on('stockUpdated', handleStockUpdate);

        return () => {
            socket.off('stockUpdated', handleStockUpdate);
        };
    }, []);

    return { products, loading };
};

export default useProductsByCategory;
