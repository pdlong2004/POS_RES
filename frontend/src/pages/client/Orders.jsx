import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/client/shared/Header';
import Footer from '../../components/client/shared/Footer';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { createOrderApi } from '../../service/order.service';

const Orders = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { items, totalPrice, updateQuantity, removeItem, clearCart, isTableLogin } = useCart();
    const [submitting, setSubmitting] = useState(false);

    const formatPrice = (price) => `${Number(price).toLocaleString('vi-VN')} VND`;

    const totalItemsCount = items.reduce((acc, it) => acc + it.quantity, 0);

    const handleSubmitOrder = async () => {
        if (!isTableLogin || items.length === 0) return;
        const tableInfo = JSON.parse(localStorage.getItem('tableInfo') || 'null');
        if (!tableInfo?._id) {
            showToast('Vui lòng đăng nhập bàn trước khi gửi đơn.', 'error');
            return;
        }
        setSubmitting(true);
        try {
            await createOrderApi(tableInfo._id, items);
            clearCart();
            showToast('Gửi đơn thành công! Nhà hàng sẽ phục vụ bạn sớm.', 'success');
            navigate('/menu');
        } catch (err) {
            showToast(err?.response?.data?.message || 'Gửi đơn thất bại. Vui lòng thử lại.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isTableLogin) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <p className="text-gray-600 mb-4">Bạn cần đăng nhập bàn để xem giỏ hàng và đặt món.</p>
                    <button
                        type="button"
                        onClick={() => navigate('/scan')}
                        className="px-6 py-3 bg-[#F89520] text-white font-semibold rounded-xl hover:opacity-90"
                    >
                        Quét QR đăng nhập bàn
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Giỏ hàng của bạn</h1>

                {items.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="mb-4">Giỏ hàng trống.</p>
                        <button
                            type="button"
                            onClick={() => navigate('/menu')}
                            className="text-[#F89520] font-medium hover:underline"
                        >
                            Xem menu và thêm món
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
                            <div className="hidden md:flex items-center text-sm text-gray-500 border-b pb-3 mb-4">
                                <div className="w-24">Sản phẩm</div>
                                <div className="flex-1">Tên sản phẩm</div>
                                <div className="w-36 text-center">Giá</div>
                                <div className="w-40 text-center">Số lượng</div>
                                <div className="w-36 text-right">Tổng tiền</div>
                                <div className="w-12"></div>
                            </div>

                            <ul className="space-y-4">
                                {items.map(({ product, quantity }) => (
                                    <li key={product._id} className="flex items-center gap-4 p-3 rounded-lg border">
                                        <div className="w-24">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                                            <p className="text-gray-500 text-sm hidden md:block">
                                                {product.description || ''}
                                            </p>
                                        </div>
                                        <div className="w-36 text-center text-gray-700 hidden md:block">
                                            {formatPrice(product.price)}
                                        </div>
                                        <div className="w-40 text-center">
                                            <div className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(product._id, quantity - 1)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200"
                                                >
                                                    −
                                                </button>
                                                <span className="w-10 text-center font-medium">{quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(product._id, quantity + 1)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="w-36 text-right font-semibold text-orange-500">
                                            {formatPrice(product.price * quantity)}
                                        </div>
                                        <div className="w-12 text-right">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(product._id)}
                                                className="p-2 rounded-full hover:bg-gray-100"
                                                aria-label="Xóa"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-gray-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <aside className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">Total</h2>
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Số sản phẩm:</span>
                                <span>{totalItemsCount}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 mb-6">
                                <span>Phí vận chuyển:</span>
                                <span>Miễn phí</span>
                            </div>

                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-gray-600">TỔNG CỘNG</span>
                                    <span className="text-2xl font-bold text-orange-500">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                                <div className="text-right text-sm text-gray-600">VND</div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => navigate('/menu')}
                                    className="w-full py-3 bg-white border text-gray-700 rounded-xl"
                                >
                                    Quay lại
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmitOrder}
                                    disabled={submitting || items.length === 0}
                                    className="w-full py-3 bg-[#F89520] text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Đang gửi...' : 'Đặt hàng'}
                                </button>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Orders;
