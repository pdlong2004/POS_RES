import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/client/shared/Header';
import Footer from '../../components/client/shared/Footer';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { createOrderApi } from '../../service/order.service';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, QrCode, UtensilsCrossed } from 'lucide-react';

const Orders = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { items, totalPrice, updateQuantity, removeItem, clearCart, isTableLogin } = useCart();
    const [submitting, setSubmitting] = useState(false);

    const formatPrice = (price) => `${Number(price).toLocaleString('vi-VN')}đ`;
    const totalItemsCount = items.reduce((acc, it) => acc + it.quantity, 0);

    const handleSubmitOrder = async () => {
        if (!isTableLogin || items.length === 0) return;
        const tableInfo = JSON.parse(sessionStorage.getItem('tableInfo') || 'null');
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
            <div className="min-h-screen flex flex-col bg-[#fffaf6]">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 bg-[#fdf0e8] text-[#C8392B] rounded-full flex items-center justify-center mb-6 shadow-inner border border-[#f5d5c0]">
                        <QrCode size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#3d2314] mb-3 mw-subheading">Chưa Đăng Nhập Bàn</h2>
                    <p className="text-[#8c6a57] mb-8 max-w-sm text-sm leading-relaxed">
                        Bạn cần quét mã QR tại bàn để hệ thống xác nhận vị trí trước khi xem giỏ hàng và đặt món.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/scan')}
                        className="mw-btn-primary group"
                    >
                        Quét QR Đăng Nhập Bàn
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#fffaf6]">
            <Header />

            {/* Page hero */}
            <div className="bg-[#1a0c08] text-white py-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <p className="mw-tag text-[#F89520] mb-1">Giỏ hàng của bạn</p>
                    <h1 className="text-3xl md:text-4xl font-bold mw-subheading">
                        <em>Your Cart</em>
                    </h1>
                    <p className="text-white/50 mt-1 text-sm">Kiểm tra lại các món ăn trước khi gửi yêu cầu phục vụ</p>
                </div>
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-10">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-500">
                        <div className="w-28 h-28 bg-[#fdf0e8] rounded-full flex items-center justify-center text-[#C8392B]/40 mb-6 border-2 border-[#f5d5c0]">
                            <ShoppingBag size={52} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#3d2314] mb-3 mw-subheading">Giỏ hàng đang trống</h2>
                        <p className="text-[#8c6a57] mb-8 max-w-sm text-sm leading-relaxed">
                            Hãy thêm những món ăn tuyệt vời từ thực đơn của chúng tôi vào giỏ hàng của bạn nhé.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate('/menu')}
                            className="mw-btn-primary group"
                        >
                            <UtensilsCrossed size={18} className="group-hover:rotate-12 transition-transform" />
                            Xem Thực Đơn
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start animate-in slide-in-from-bottom-8 duration-500">
                        {/* LEFT: Cart items */}
                        <div className="w-full lg:flex-[2] space-y-4">
                            <div className="bg-white rounded-3xl border border-[#f5e8d8] shadow-sm overflow-hidden">
                                {/* Cart header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-[#f5e8d8] bg-[#fffaf6]">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-[#3d2314] text-sm uppercase tracking-widest">
                                            Sản phẩm đã chọn
                                        </h3>
                                        <span className="w-6 h-6 flex items-center justify-center bg-[#C8392B] text-white text-xs font-bold rounded-full">
                                            {totalItemsCount}
                                        </span>
                                    </div>
                                    <button
                                        onClick={clearCart}
                                        className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        Xóa tất cả
                                    </button>
                                </div>

                                {/* Items */}
                                <ul className="divide-y divide-[#f5e8d8]">
                                    {items.map(({ product, quantity }) => (
                                        <li key={product._id} className="flex gap-4 p-5 group hover:bg-[#fffaf6] transition-colors">
                                            {/* Image */}
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden border border-[#f5e8d8]">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col justify-between py-0.5">
                                                <div className="flex justify-between items-start gap-3">
                                                    <div>
                                                        <h3 className="font-bold text-[#3d2314] leading-snug text-sm sm:text-base mb-0.5">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-xs text-[#b89c8a] line-clamp-1">
                                                            {product.description || 'Món ăn đặc sắc từ nhà hàng'}
                                                        </p>
                                                    </div>
                                                    <p className="text-base font-bold text-[#C8392B] shrink-0 mw-subheading">
                                                        {formatPrice(product.price * quantity)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between mt-3">
                                                    {/* Quantity control */}
                                                    <div className="flex items-center gap-1.5 bg-[#fffaf6] border border-[#e8d5c4] rounded-full px-1.5 py-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(product._id, quantity - 1)}
                                                            className="w-7 h-7 rounded-full flex items-center justify-center text-[#C8392B] hover:bg-[#fdf0e8] transition-colors"
                                                        >
                                                            <Minus size={14} strokeWidth={2.5} />
                                                        </button>
                                                        <span className="w-8 text-center font-bold text-[#3d2314] text-sm">
                                                            {quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(product._id, quantity + 1)}
                                                            className="w-7 h-7 rounded-full flex items-center justify-center text-[#C8392B] hover:bg-[#fdf0e8] transition-colors"
                                                        >
                                                            <Plus size={14} strokeWidth={2.5} />
                                                        </button>
                                                    </div>

                                                    <p className="text-xs text-[#b89c8a]">
                                                        {formatPrice(product.price)} / món
                                                    </p>

                                                    {/* Delete */}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(product._id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full text-[#d5bfb4] hover:text-red-500 hover:bg-red-50 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* RIGHT: Summary */}
                        <div className="w-full lg:flex-1 lg:max-w-[380px]">
                            <div className="bg-white rounded-3xl border border-[#f5e8d8] shadow-sm overflow-hidden sticky top-24">
                                <div className="px-6 py-4 bg-[#1a0c08] text-white">
                                    <h2 className="font-bold text-lg mw-subheading">Tóm tắt đơn hàng</h2>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between text-sm text-[#8c6a57]">
                                        <span>Số lượng món ({totalItemsCount})</span>
                                        <span className="text-[#3d2314] font-semibold">{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-[#8c6a57]">
                                        <span>Phí phục vụ</span>
                                        <span className="text-green-600 font-semibold">Miễn phí</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-[#8c6a57]">
                                        <span>Thuế & Phí dịch vụ</span>
                                        <span className="text-[#3d2314] font-semibold">Đã bao gồm</span>
                                    </div>

                                    <div className="border-t border-[#f5e8d8] pt-4 flex justify-between items-end">
                                        <span className="text-xs font-bold text-[#b89c8a] uppercase tracking-widest">
                                            Tổng cộng
                                        </span>
                                        <span className="text-3xl font-bold text-[#C8392B] mw-subheading">
                                            {formatPrice(totalPrice)}
                                        </span>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleSubmitOrder}
                                            disabled={submitting}
                                            className={`mw-btn-primary w-full ${submitting ? 'opacity-70 cursor-not-allowed hover:translate-y-0' : ''}`}
                                        >
                                            {submitting ? (
                                                <><Loader2 className="w-5 h-5 animate-spin" /> Đang gửi...</>
                                            ) : (
                                                'Gửi Yêu Cầu Đặt Món'
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => navigate('/menu')}
                                            disabled={submitting}
                                            className="mw-btn-outline w-full"
                                        >
                                            Gọi thêm món
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Orders;

