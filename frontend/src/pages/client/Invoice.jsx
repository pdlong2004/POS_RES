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

const Invoice = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('bank');
    const [qrType, setQrType] = useState('vietqr');

    const tableToken = localStorage.getItem('tableToken');
    const tableInfo = JSON.parse(localStorage.getItem('tableInfo') || 'null');
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
            const res = await axios.put(`http://localhost:5001/api/invoices/${invoice._id}/pay`, {
                paymentMethod,
            });

            if (res.data?.success) {
                showToast('Thanh toán thành công', 'success');
                await fetchInvoices();

                try {
                    // set table to empty so UI shows clean state
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

                localStorage.removeItem('tableToken');
                localStorage.removeItem('tableInfo');
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
            <div className="min-h-screen flex flex-col bg-gray-100">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <button
                        onClick={() => navigate('/scan')}
                        className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                        Quét QR đăng nhập bàn
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-bold mb-2">Chi tiết đơn hàng</h2>

                    {loading ? (
                        <p>Đang tải...</p>
                    ) : !invoice ? (
                        <p>Chưa có đơn hàng</p>
                    ) : (
                        <>
                            <p className="mb-4 text-sm text-gray-500">
                                Đơn hàng #{invoice._id?.slice(-6)} – Trạng thái:{' '}
                                {invoice.paymentStatus === 'paid'
                                    ? 'Đã thanh toán'
                                    : invoice.paymentStatus === 'cancelled'
                                      ? 'Đã hủy'
                                      : 'Chưa thanh toán'}
                            </p>

                            <table className="w-full text-left border rounded overflow-hidden">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">Tên món</th>
                                        <th className="p-2 border text-center">SL</th>
                                        <th className="p-2 border text-right">Giá</th>
                                        <th className="p-2 border text-right">Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
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
                                            <tr key={item._id || index}>
                                                <td className="p-2 border">{name}</td>
                                                <td className="p-2 border text-center">{qty}</td>
                                                <td className="p-2 border text-right">{formatPrice(unitPrice)} VND</td>
                                                <td className="p-2 border text-right">
                                                    {formatPrice(unitPrice * qty)} VND
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>

                {/* RIGHT - TOTAL + THANH TOÁN */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-bold mb-4">Total</h3>

                    {invoice && (
                        <>
                            <div className="flex justify-between mb-2">
                                <span>Tổng tiền:</span>
                                <span>{formatPrice(invoice.itemsSubtotal)} VND</span>
                            </div>

                            {invoice.taxAmount > 0 && (
                                <div className="flex justify-between mb-2">
                                    <span>Thuế:</span>
                                    <span>{formatPrice(invoice.taxAmount)} VND</span>
                                </div>
                            )}

                            {invoice.serviceCharge > 0 && (
                                <div className="flex justify-between mb-2">
                                    <span>Phí phục vụ:</span>
                                    <span>{formatPrice(invoice.serviceCharge)} VND</span>
                                </div>
                            )}

                            {invoice.discountAmount > 0 && (
                                <div className="flex justify-between text-green-600 mb-2">
                                    <span>Giảm giá:</span>
                                    <span>- {formatPrice(invoice.discountAmount)} VND</span>
                                </div>
                            )}

                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Thành tiền:</span>
                                <span>{formatPrice(invoice.totalPrice)} VND</span>
                            </div>
                        </>
                    )}

                    <input placeholder="Nhập mã khuyến mãi" className="w-full border rounded px-3 py-2 my-3" />

                    <select
                        className="w-full border px-3 py-2 rounded mb-3"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="bank">Thẻ ngân hàng</option>
                        <option value="qr">QR Pay</option>
                        <option value="cash">Tiền mặt</option>
                    </select>

                    {paymentMethod === 'qr' && (
                        <div className="border rounded p-3 mt-3">
                            <div className="flex gap-2 mb-3">
                                {['vietqr', 'momo', 'zalopay'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setQrType(type)}
                                        className={`px-3 py-1 border rounded ${
                                            qrType === type ? 'bg-orange-500 text-white' : ''
                                        }`}
                                    >
                                        {type.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-center">
                                <img src={QR_IMAGES[qrType]} alt="QR" className="w-48 h-48" />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handlePay}
                        disabled={loading || invoice?.paymentStatus === 'paid'}
                        className={`w-full mt-4 py-2 rounded ${
                            invoice?.paymentStatus === 'paid'
                                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                                : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                    >
                        {invoice?.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Thanh toán'}
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Invoice;
