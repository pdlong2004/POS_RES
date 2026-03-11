import React, { useState, useEffect } from 'react';
import { FaCartPlus } from 'react-icons/fa6';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/ToastContext';

const ProductModal = ({ product, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [addSuccess, setAddSuccess] = useState(false);
    const { isTableLogin, addItem } = useCart();
    const { showToast } = useToast();

    useEffect(() => {
        if (product) {
            setQuantity(1);
            setAddSuccess(false);
        }
    }, [product]);

    if (!product) return null;

    const formatPrice = (price) => Number(price).toLocaleString('vi-VN');

    const increase = () => setQuantity((q) => q + 1);
    const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    const handleAddToCart = () => {
        if (!isTableLogin) {
            showToast('Vui lòng quét mã QR tại bàn để đăng nhập trước khi thêm món.', 'error');
            return;
        }
        addItem(product, quantity);
        setAddSuccess(true);
        showToast('Đã thêm vào giỏ hàng', 'success');
        setTimeout(() => onClose(), 1200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div
                className="relative bg-white rounded-2xl shadow-xl w-[80%]
                lg:w-[60%] sm:h-[60%] lg:h-[80%] p-5
                grid grid-cols-2 gap-6
                animate-scaleIn"
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
                >
                    ✕
                </button>

                <div>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                </div>

                <div className="flex flex-col">
                    <h2 className="text-2xl font-semibold">{product.name}</h2>

                    <p className="mt-2 text-xl font-bold text-orange-500">{formatPrice(product.price)} đ</p>

                    {!isTableLogin && (
                        <p className="mt-2 text-sm text-amber-600">
                            Vui lòng quét mã QR tại bàn để thêm món vào giỏ.
                        </p>
                    )}

                    <div className="mt-6 flex items-center gap-4 mb-2">
                        <span className="hidden sm:block font-medium">Số lượng</span>

                        <div className="flex items-center gap-3 ">
                            <button
                                onClick={decrease}
                                className="w-9 h-9 rounded-full border
                                flex items-center justify-center
                                text-lg font-bold hover:bg-gray-100"
                            >
                                −
                            </button>

                            <span className="min-w-8 text-center font-semibold">{quantity}</span>

                            <button
                                onClick={increase}
                                className="w-9 h-9 rounded-full border
                                flex items-center justify-center
                                text-lg font-bold hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 justify-between font-semibold hidden sm:flex">
                        <span>Tạm tính</span>
                        <span className="text-orange-500">{formatPrice(product.price * quantity)} đ</span>
                    </div>

                    {addSuccess ? (
                        <div className="mt-auto flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-semibold">
                            ✓ Đã thêm vào giỏ hàng
                        </div>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            className="mt-auto flex items-center justify-center gap-2
                            py-3 rounded-xl
                            bg-orange-500 text-white font-semibold
                            hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={!isTableLogin}
                        >
                            <FaCartPlus />
                            Thêm vào giỏ ({quantity})
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
