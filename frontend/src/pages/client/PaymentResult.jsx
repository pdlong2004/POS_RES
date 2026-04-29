import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/client/shared/Header';
import Footer from '../../components/client/shared/Footer';
import { useToast } from '../../context/ToastContext';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const status = searchParams.get('status');
    const invoiceId = searchParams.get('invoiceId');

    useEffect(() => {
        if (status === 'success') {
            showToast('Thanh toán thành công qua VNPay', 'success');
            sessionStorage.removeItem('tableToken');
            sessionStorage.removeItem('tableInfo');
        } else if (status === 'fail') {
            showToast('Thanh toán VNPay thất bại hoặc bị hủy', 'error');
        } else {
            showToast('Đã xảy ra lỗi khi xử lý thanh toán', 'error');
        }
    }, [status, showToast]);

    const isSuccess = status === 'success';

    return (
        <div className="min-h-screen flex flex-col bg-[#fffaf6]">
            <Header />

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl border border-[#f5e8d8] shadow-md max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-500">
                    {/* Top colored band */}
                    <div className={`h-2 ${isSuccess ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-[#C8392B] to-red-400'}`} />

                    <div className="p-8 text-center">
                        {/* Icon */}
                        <div
                            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${
                                isSuccess ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                            }`}
                        >
                            {isSuccess ? (
                                <svg className="w-9 h-9 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-9 h-9 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>

                        {/* Logo */}
                        <img
                            src="https://manwah.com.vn/images/logo/manwah.svg"
                            alt="Manwah"
                            className="h-8 w-auto mx-auto mb-4 opacity-40"
                        />

                        <h2 className="text-2xl font-bold text-[#3d2314] mb-2 mw-subheading">
                            {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                        </h2>

                        <p className="text-[#8c6a57] mb-2 text-sm leading-relaxed">
                            {isSuccess
                                ? 'Cảm ơn bạn đã sử dụng dịch vụ của Manwah. Chúc bạn ngon miệng! 🍲'
                                : status === 'fail'
                                ? 'Giao dịch không thành công hoặc đã bị hủy. Vui lòng thử lại.'
                                : 'Có lỗi xảy ra trong quá trình xử lý. Vui lòng liên hệ nhân viên.'}
                        </p>

                        {invoiceId && (
                            <p className="text-xs text-[#b89c8a] mb-6">
                                Mã hóa đơn: <span className="font-mono font-bold">{invoiceId.slice(-8).toUpperCase()}</span>
                            </p>
                        )}

                        <div className="space-y-3 mt-6">
                            <button
                                onClick={() => navigate('/')}
                                className="mw-btn-primary w-full"
                            >
                                Quay lại trang chủ
                            </button>
                            {!isSuccess && (
                                <button
                                    onClick={() => navigate('/invoice')}
                                    className="mw-btn-outline w-full"
                                >
                                    Thử lại thanh toán
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PaymentResult;

