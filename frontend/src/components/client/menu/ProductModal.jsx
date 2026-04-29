import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { FaCartPlus } from 'react-icons/fa6';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/ToastContext';

const ProductModal = ({ product, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [addSuccess, setAddSuccess] = useState(false);
    const { isTableLogin, addItem } = useCart();
    const { showToast } = useToast();

    // 🚀 Performance: Reset state only when product changes
    useEffect(() => {
        if (product) {
            setQuantity(1);
            setAddSuccess(false);
        }
    }, [product]);

    // 🚀 Performance: Memoized formatting
    const formatPrice = useCallback((price) => 
        Number(price).toLocaleString('vi-VN'), []);

    const increase = useCallback(() => setQuantity((q) => q + 1), []);
    const decrease = useCallback(() => setQuantity((q) => (q > 1 ? q - 1 : 1)), []);

    // 🚀 Performance: Memoized total calculation
    const totalPrice = useMemo(() => 
        product ? product.price * quantity : 0, 
    [product, quantity]);

    const handleAddToCart = useCallback(() => {
        if (!isTableLogin) {
            showToast('Vui lòng quét mã QR tại bàn để đăng nhập trước khi thêm món.', 'error');
            return;
        }
        addItem(product, quantity);
        setAddSuccess(true);
        showToast('Đã thêm vào giỏ hàng', 'success');
        
        // UX: Small delay for feedback before closing
        const timer = setTimeout(() => onClose(), 1200);
        return () => clearTimeout(timer);
    }, [isTableLogin, addItem, product, quantity, showToast, onClose]);

    if (!product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop with Fade In */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal with Slide & Zoom In */}
            <div className="relative bg-white w-full sm:w-auto sm:max-w-2xl sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300 ease-out">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-[#8c6a57] hover:bg-[#fdf0e8] hover:text-[#C8392B] transition-all shadow-md active:scale-90"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2">
                    {/* Image Section */}
                    <div className="relative aspect-square sm:aspect-auto sm:h-full min-h-60 overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col p-6 lg:p-8">
                        <div className="flex-1">
                            <span className="mw-tag block mb-2">Món ăn</span>
                            <h2 className="text-2xl font-bold text-[#3d2314] mw-subheading leading-tight mb-3">
                                {product.name}
                            </h2>

                            <p className="text-3xl font-bold text-[#C8392B] mw-subheading mb-1">
                                {formatPrice(product.price)}<span className="text-lg ml-1">đ</span>
                            </p>

                            {product.description && (
                                <p className="text-sm text-[#8c6a57] leading-relaxed mt-3 mb-4 line-clamp-3">
                                    {product.description}
                                </p>
                            )}

                            {!isTableLogin && (
                                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mt-3 animate-pulse">
                                    <span className="text-amber-600 mt-0.5 shrink-0">⚠️</span>
                                    <p className="text-xs text-amber-700 font-medium">
                                        Vui lòng quét mã QR tại bàn để thêm món vào giỏ.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-[#5a3e30]">Số lượng</span>
                                <div className="flex items-center gap-3 bg-[#fffaf6] border border-[#e8d5c4] rounded-full px-2 py-1">
                                    <button
                                        onClick={decrease}
                                        className="w-8 h-8 flex items-center justify-center rounded-full text-[#C8392B] font-bold hover:bg-[#fdf0e8] transition-all text-lg active:scale-75"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center font-bold text-[#3d2314] text-base">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={increase}
                                        className="w-8 h-8 flex items-center justify-center rounded-full text-[#C8392B] font-bold hover:bg-[#fdf0e8] transition-all text-lg active:scale-75"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-[#f5e8d8]">
                                <span className="text-sm font-semibold text-[#8c6a57]">Tạm tính</span>
                                <span className="text-xl font-bold text-[#C8392B] mw-subheading">
                                    {formatPrice(totalPrice)}đ
                                </span>
                            </div>

                            {addSuccess ? (
                                <div className="flex items-center justify-center gap-2 py-3.5 rounded-full bg-green-500 text-white font-bold text-sm animate-in zoom-in duration-300">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Đã thêm vào giỏ hàng
                                </div>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!isTableLogin}
                                    className={`mw-btn-primary w-full transition-all active:scale-95 ${!isTableLogin ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                >
                                    <FaCartPlus />
                                    Thêm vào giỏ ({quantity})
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductModal);

