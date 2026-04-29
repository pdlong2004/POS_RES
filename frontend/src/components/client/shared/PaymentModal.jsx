import React from 'react';

const QR_MAP = {
    vietqr: {
        name: 'VietQR',
        img: 'https://img.vietqr.io/image/970422-19036592628010-compact.png',
    },
    momo: {
        name: 'MoMo',
        img: 'https://developers.momo.vn/v3/assets/images/qr-code-sample.png',
    },
    zalopay: {
        name: 'ZaloPay',
        img: 'https://stc-zalopay.zdn.vn/assets/images/qr-sample.png',
    },
};

const PaymentModal = ({ open, method, onClose, onConfirm }) => {
    if (!open || !method) return null;

    const qr = QR_MAP[method];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-[320px] text-center">
                <h2 className="text-lg font-bold mb-2">Quét mã {qr.name}</h2>

                <img src={qr.img} alt={qr.name} className="w-56 h-56 mx-auto border rounded-lg" />

                <p className="text-sm text-gray-600 mt-3">Mở app {qr.name} để quét mã và thanh toán</p>

                <div className="flex gap-2 mt-5">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100">
                        Huỷ
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                        Tôi đã thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;

