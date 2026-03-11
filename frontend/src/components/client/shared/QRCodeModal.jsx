import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { IoClose } from 'react-icons/io5';

const QRCodeModal = ({ table, onClose }) => {
    if (!table) return null;

    const qrValue = `${window.location.origin}/table-login/${table._id}`;

    const downloadQRCode = () => {
        const canvas = document.getElementById('qr-gen');
        const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');

        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_Table_${table.name}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-sm relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
                    <IoClose size={24} />
                </button>

                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Mã QR của bàn</h3>
                    <p className="text-gray-500 mb-4 font-medium">{table.name}</p>

                    {/* QR */}
                    <div className="flex justify-center mb-4 p-4 border rounded-lg">
                        <QRCodeCanvas id="qr-gen" value={qrValue} size={200} level="H" includeMargin />
                    </div>

                    <p className="text-xs text-gray-400 break-all mb-3">{qrValue}</p>

                    <button
                        onClick={downloadQRCode}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
                    >
                        Tải mã QR
                    </button>

                    <p className="mt-3 text-xs text-gray-400">Quét mã để mở website và đăng nhập vào bàn</p>
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal;
