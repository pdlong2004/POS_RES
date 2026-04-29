import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getStatusTablesApi } from '@/service/statusTable.service';
import { updateTableStatusApi } from '@/service/table.service';
import Header from '../../components/client/shared/Header';
import Footer from '../../components/client/shared/Footer';
import { useToast } from '../../context/ToastContext';

const QR_IMAGES = {
    vietqr: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=VietQR-Demo',
    momo: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=MoMo-Demo',
    zalopay: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=ZaloPay-Demo',
};

const PAYMENT_METHODS = [
    { value: 'bank', label: 'Thẻ ngân hàng', icon: '🏦' },
    { value: 'qr', label: 'QR Pay', icon: '📱' },
    { value: 'vnpay', label: 'VNPay', icon: '💳' },
    { value: 'cash', label: 'Tiền mặt', icon: '💵' },
];

const Invoice = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('bank');
    const [qrType, setQrType] = useState('vietqr');

    const tableToken = sessionStorage.getItem('tableToken');
    const tableInfo = JSON.parse(sessionStorage.getItem('tableInfo') || 'null');
    const isTableLogin = !!tableToken;

    const formatPrice = (price) => Number(price || 0).toLocaleString('vi-VN');

    useEffect(() => {
        if (isTableLogin && tableInfo?._id) {
            fetchInvoices();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5001/api/invoices`, {
                params: { tableId: tableInfo._id, paymentStatus: 'pending' },
            });
            if (res.data.success) setInvoices(res.data.data || []);
        } catch (err) {
            console.error(err);
            showToast('Không thể tải hóa đơn', 'error');
        } finally {
            setLoading(false);
        }
    };

    const invoice = invoices?.[0];

    const handlePay = async () => {
        if (!invoice || invoice.paymentStatus === 'paid') return;

        try {
            setLoading(true);

            if (paymentMethod === 'vnpay') {
                const res = await axios.post(`http://localhost:5001/api/vnpay/create_payment_url`, {
                    invoiceId: invoice._id,
                });
                if (res.data?.paymentUrl) {
                    window.location.href = res.data.paymentUrl;
                    return;
                } else {
                    showToast('Không thể tạo link thanh toán VNPay', 'error');
                    return;
                }
            }

            const res = await axios.put(`http://localhost:5001/api/invoices/${invoice._id}/pay`, {
                paymentMethod,
            });

            if (res.data?.success) {
                showToast('Thanh toán thành công', 'success');
                await fetchInvoices();

                try {
                    if (tableInfo?._id) {
                        const statuses = await getStatusTablesApi();
                        const list = statuses?.data ?? [];
                        const empty = list.find((s) => s.code === 'empty');
                        if (empty) {
                            await updateTableStatusApi(tableInfo._id, empty._id);
                        }
                    }
                } catch (e) {
                    console.error('Failed to set table empty after payment', e);
                }

                sessionStorage.removeItem('tableToken');
                sessionStorage.removeItem('tableInfo');
                setTimeout(() => navigate('/'), 1000);
            } else {
                showToast(res.data?.message || 'Thanh toán thất bại', 'error');
            }
        } catch (err) {
            console.error('Pay error', err);
            showToast('Lỗi khi thanh toán', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isTableLogin) {
        return (
            <div className="min-h-screen flex flex-col bg-[#fffaf6]">
                <Header />
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                        <div className="text-5xl mb-4">🧾</div>
                        <h2 className="text-xl font-bold text-[#3d2314] mb-3 mw-subheading">Chưa đăng nhập bàn</h2>
                        <p className="text-[#8c6a57] text-sm mb-6">Quét mã QR tại bàn để xem hóa đơn của bạn</p>
                        <button
                            onClick={() => navigate('/scan')}
                            className="mw-btn-primary"
                        >
                            Quét QR đăng nhập bàn
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#fffaf6]">
            <Header />

            {/* Hero */}
            <div className="bg-[#1a0c08] text-white py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    <p className="mw-tag text-[#F89520] mb-1">Hóa đơn</p>
                    <h1 className="text-3xl md:text-4xl font-bold mw-subheading">
                        <em>Chi Tiết Thanh Toán</em>
                    </h1>
                    {tableInfo?.name && (
                        <p className="text-white/50 mt-1 text-sm">🪑 {tableInfo.name}</p>
                    )}
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Order items */}
                <div className="md:col-span-2 bg-white rounded-3xl border border-[#f5e8d8] shadow-sm overflow-hidden">
                    {/* Card header */}
                    <div className="px-6 py-4 border-b border-[#f5e8d8] bg-[#fffaf6] flex items-center justify-between">
                        <h2 className="font-bold text-[#3d2314]">Chi tiết đơn hàng</h2>
                        {invoice && (
                            <span className={`mw-badge ${invoice.paymentStatus === 'paid' ? '!bg-green-50 !text-green-600 !border-green-200' : ''}`}>
                                {invoice.paymentStatus === 'paid'
                                    ? '✓ Đã thanh toán'
                                    : invoice.paymentStatus === 'cancelled'
                                    ? 'Đã hủy'
                                    : '⏳ Chờ thanh toán'}
                            </span>
                        )}
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-10 h-10 border-3 border-[#C8392B] border-t-transparent rounded-full animate-spin mb-3" />
                                <p className="text-[#8c6a57] text-sm">Đang tải hóa đơn...</p>
                            </div>
                        ) : !invoice ? (
                            <div className="text-center py-16">
                                <div className="text-4xl mb-3">🍽️</div>
                                <p className="text-[#8c6a57]">Chưa có đơn hàng nào</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-xs text-[#b89c8a] mb-4 font-medium">
                                    Đơn hàng #{invoice._id?.slice(-6).toUpperCase()}
                                </p>

                                <div className="overflow-hidden rounded-2xl border border-[#f5e8d8]">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-[#fdf5ec] text-[#8c6a57]">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold">Tên món</th>
                                                <th className="px-4 py-3 font-semibold text-center">SL</th>
                                                <th className="px-4 py-3 font-semibold text-right">Đơn giá</th>
                                                <th className="px-4 py-3 font-semibold text-right">Tổng</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#f5e8d8]">
                                            {invoice.items?.map((item, index) => {
                                                const product = item.productId || item.product;
                                                const name =
                                                    item.name ||
                                                    product?.name ||
                                                    item.food?.name ||
                                                    item.menuItem?.name ||
                                                    'Chưa có tên món';
                                                const unitPrice = Number(item.price ?? product?.price ?? 0);
                                                const qty = Number(item.quantity ?? 0);
                                                return (
                                                    <tr key={item._id || index} className="hover:bg-[#fffaf6] transition-colors">
                                                        <td className="px-4 py-3 font-medium text-[#3d2314]">{name}</td>
                                                        <td className="px-4 py-3 text-center text-[#8c6a57]">{qty}</td>
                                                        <td className="px-4 py-3 text-right text-[#8c6a57]">
                                                            {formatPrice(unitPrice)}đ
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-bold text-[#C8392B]">
                                                            {formatPrice(unitPrice * qty)}đ
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right: Total + Payment */}
                <div className="bg-white rounded-3xl border border-[#f5e8d8] shadow-sm overflow-hidden sticky top-24 self-start">
                    <div className="px-6 py-4 bg-[#1a0c08] text-white">
                        <h3 className="font-bold mw-subheading">Tổng cộng</h3>
                    </div>

                    <div className="p-6 space-y-4">
                        {invoice && (
                            <>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-[#8c6a57]">
                                        <span>Tạm tính:</span>
                                        <span className="text-[#3d2314] font-semibold">{formatPrice(invoice.itemsSubtotal)}đ</span>
                                    </div>

                                    {invoice.taxAmount > 0 && (
                                        <div className="flex justify-between text-[#8c6a57]">
                                            <span>Thuế:</span>
                                            <span className="text-[#3d2314] font-semibold">{formatPrice(invoice.taxAmount)}đ</span>
                                        </div>
                                    )}

                                    {invoice.serviceCharge > 0 && (
                                        <div className="flex justify-between text-[#8c6a57]">
                                            <span>Phí phục vụ:</span>
                                            <span className="text-[#3d2314] font-semibold">{formatPrice(invoice.serviceCharge)}đ</span>
                                        </div>
                                    )}

                                    {invoice.discountAmount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Giảm giá:</span>
                                            <span className="font-semibold">−{formatPrice(invoice.discountAmount)}đ</span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-[#f5e8d8] pt-3 flex justify-between items-end">
                                    <span className="text-xs font-bold text-[#b89c8a] uppercase tracking-widest">Thành tiền</span>
                                    <span className="text-2xl font-bold text-[#C8392B] mw-subheading">
                                        {formatPrice(invoice.totalPrice)}đ
                                    </span>
                                </div>
                            </>
                        )}

                        {/* Promo code */}
                        <input
                            placeholder="Nhập mã khuyến mãi..."
                            className="mw-input text-sm"
                        />

                        {/* Payment method */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#8c6a57] uppercase tracking-widest">
                                Phương thức thanh toán
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {PAYMENT_METHODS.map((m) => (
                                    <button
                                        key={m.value}
                                        onClick={() => setPaymentMethod(m.value)}
                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                                            paymentMethod === m.value
                                                ? 'border-[#C8392B] bg-[#fdf0e8] text-[#C8392B]'
                                                : 'border-[#e8d5c4] text-[#8c6a57] hover:border-[#C8392B]/50 hover:text-[#C8392B]'
                                        }`}
                                    >
                                        <span>{m.icon}</span>
                                        <span className="text-xs">{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* QR sub-options */}
                        {paymentMethod === 'qr' && (
                            <div className="p-4 bg-[#fffaf6] border border-[#f5e8d8] rounded-2xl space-y-3">
                                <div className="flex gap-2">
                                    {['vietqr', 'momo', 'zalopay'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setQrType(type)}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                qrType === type
                                                    ? 'bg-[#C8392B] text-white shadow'
                                                    : 'bg-white border border-[#e8d5c4] text-[#8c6a57]'
                                            }`}
                                        >
                                            {type.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-center">
                                    <img src={QR_IMAGES[qrType]} alt="QR Code" className="w-40 h-40 rounded-lg" />
                                </div>
                            </div>
                        )}

                        {/* Pay button */}
                        <button
                            onClick={handlePay}
                            disabled={loading || invoice?.paymentStatus === 'paid'}
                            className={`w-full ${
                                invoice?.paymentStatus === 'paid'
                                    ? 'py-3.5 rounded-full bg-green-100 text-green-700 font-bold cursor-default'
                                    : 'mw-btn-primary w-full'
                            } ${loading ? 'opacity-60 cursor-wait' : ''}`}
                        >
                            {invoice?.paymentStatus === 'paid' ? '✓ Đã thanh toán' : 'Thanh Toán Ngay'}
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Invoice;

