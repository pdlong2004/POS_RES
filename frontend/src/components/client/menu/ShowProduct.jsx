import React, { useState, memo, useCallback } from 'react';
import ProductModal from './ProductModal';

// ========================
// 🚀 PERFORMANCE: MEMOIZED PRODUCT CARD
// Prevents entire list from re-rendering when one item is clicked or state changes.
// ========================

const ProductCard = memo(({ product, onClick }) => {
    const isOutOfStock = product.stock_quantity <= 0;
    const formatPrice = (price) => Number(price).toLocaleString('vi-VN');

    return (
        <div
            onClick={() => !isOutOfStock && onClick(product)}
            className={`group bg-white rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 transform active:scale-95 ${
                isOutOfStock
                    ? 'border-[#f0e8e0] opacity-70 cursor-not-allowed'
                    : 'border-[#f5e8d8] cursor-pointer hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#C8392B]/8 hover:border-[#f5d5c0]'
            }`}
        >
            {/* Image Section */}
            <div className="relative overflow-hidden aspect-[4/3]">
                <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                        isOutOfStock ? 'grayscale opacity-60' : 'group-hover:scale-110'
                    }`}
                    loading="lazy"
                />

                {isOutOfStock ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                        <div className="border-2 border-white rounded px-3 py-1 -rotate-12 bg-black/40">
                            <span className="text-white font-black tracking-widest uppercase text-xs drop-shadow">
                                HẾT MÓN
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="absolute bottom-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full bg-[#C8392B] text-white shadow-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                        <span className="text-lg font-bold leading-none pb-0.5">+</span>
                    </div>
                )}

                {product.isNew && (
                    <div className="absolute top-2 left-2 mw-badge">Mới</div>
                )}
            </div>

            {/* Info Section */}
            <div className="flex flex-col flex-1 p-3.5">
                <h3 className={`font-semibold text-sm leading-snug line-clamp-2 mb-2 flex-1 ${
                    isOutOfStock ? 'text-[#b89c8a]' : 'text-[#3d2314] group-hover:text-[#C8392B] transition-colors'
                }`}>
                    {product.name}
                </h3>
                <p className={`text-base font-bold mw-subheading ${
                    isOutOfStock ? 'text-[#b89c8a] line-through decoration-1' : 'text-[#C8392B]'
                }`}>
                    {formatPrice(product.price)}đ
                </p>
            </div>
        </div>
    );
});

const ShowProduct = ({ products }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);

    // 🚀 Performance: Memoized Click Handler
    const handleProductClick = useCallback((product) => {
        setSelectedProduct(product);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedProduct(null);
    }, []);

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-5">
                {products?.map((product) => (
                    <ProductCard 
                        key={product._id} 
                        product={product} 
                        onClick={handleProductClick} 
                    />
                ))}
            </div>

            <ProductModal 
                product={selectedProduct} 
                onClose={handleCloseModal} 
            />
        </>
    );
};

export default memo(ShowProduct);

