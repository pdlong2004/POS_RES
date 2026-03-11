import React, { useState } from 'react';
import ProductModal from './ProductModal';

const ShowProduct = ({ products }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const formatPrice = (price) => Number(price).toLocaleString('vi-VN');

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:gap-6 sm:gap-4 gap-2">
                {products?.map((product) => {
                    const isOutOfStock = product.stock_quantity <= 0;
                    
                    return (
                        <div
                            key={product._id}
                            onClick={() => !isOutOfStock && setSelectedProduct(product)}
                            className={`
                                bg-white rounded-xl p-3 shadow-md border
                                flex flex-col h-full relative overflow-hidden
                                transition-all duration-300
                                ${isOutOfStock 
                                    ? 'border-slate-200 bg-slate-100 opacity-90 cursor-not-allowed' 
                                    : 'border-transparent cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-orange-100'
                                }
                            `}
                        >
                            <div className="relative rounded-lg overflow-hidden group">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className={`w-full h-40 object-cover transition-transform duration-500 ${isOutOfStock ? 'grayscale opacity-70' : 'group-hover:scale-105'}`}
                                />

                                {isOutOfStock && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] z-10">
                                        <div className="border-2 border-white rounded px-3 py-1 transform -rotate-12 bg-black/40 shadow-lg">
                                            <span className="text-white font-black tracking-widest uppercase text-xs drop-shadow-md">
                                                HẾT MÓN
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {!isOutOfStock && (
                                    <div
                                        className="absolute bottom-2 right-2
                                        w-8 h-8 flex items-center justify-center
                                        rounded-full bg-white shadow-md border border-slate-100
                                        text-lg font-bold text-orange-600
                                        transition-transform group-hover:scale-110"
                                    >
                                        +
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col flex-1 mt-3">
                                <h3 className={`font-semibold line-clamp-2 min-h-11 leading-tight ${isOutOfStock ? 'text-slate-400' : 'text-slate-800'}`}>
                                    {product.name}
                                </h3>

                                <div className="mt-auto pt-2 flex items-end justify-between">
                                    <p className={`text-base font-bold ${isOutOfStock ? 'text-slate-400 line-through decoration-1' : 'text-orange-500'}`}>
                                        {formatPrice(product.price)} đ
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        </>
    );
};

export default ShowProduct;
