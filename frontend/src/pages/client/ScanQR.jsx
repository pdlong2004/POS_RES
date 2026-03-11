import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { useToast } from '../../context/ToastContext';

const ScanQR = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const qrInstanceRef = useRef(null);
    const startedRef = useRef(false);
    const scannedRef = useRef(false);

    const stopCameraSafe = () => {
        try {
            if (qrInstanceRef.current && startedRef.current) {
                qrInstanceRef.current
                    .stop()
                    .then(() => {
                        qrInstanceRef.current?.clear();
                    })
                    .catch(() => {});
            }
        } catch {}
        startedRef.current = false;
        qrInstanceRef.current = null;
    };

    useEffect(() => {
        const onScanSuccess = async (decodedText) => {
            if (scannedRef.current) return;
            scannedRef.current = true;

            let path = decodedText;
            try {
                if (decodedText.startsWith('http')) {
                    path = new URL(decodedText).pathname;
                }
            } catch {}

            const match = path.match(/\/(?:table-login|table)\/([a-f0-9]{24})/i);
            const tableId = match?.[1] || (/^[a-f0-9]{24}$/i.test(decodedText.trim()) ? decodedText.trim() : null);

            if (!tableId) {
                scannedRef.current = false;
                showToast('Mã QR không hợp lệ. Vui lòng quét mã QR tại bàn.', 'error');
                return;
            }

            stopCameraSafe();
            navigate(`/table-login/${tableId}`, { replace: true });
        };

        const startCamera = async () => {
            try {
                const qr = new Html5Qrcode('qr-reader');
                qrInstanceRef.current = qr;

                await qr.start(
                    { facingMode: 'environment' },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    onScanSuccess,
                );

                startedRef.current = true;
            } catch (err) {
                console.error(err);
                showToast('Không thể mở camera. Vui lòng kiểm tra quyền truy cập.', 'error');
            }
        };

        startCamera();

        return () => {
            stopCameraSafe();
        };
    }, [navigate, showToast]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <h1 className="text-xl font-bold text-gray-800 mb-2">Quét mã QR tại bàn</h1>

            <p className="text-gray-500 text-sm mb-4 text-center">Đưa camera vào mã QR trên bàn để đăng nhập gọi món</p>

            <div id="qr-reader" className="w-full max-w-md h-80 rounded-xl overflow-hidden shadow-lg bg-black" />

            <button
                type="button"
                onClick={() => {
                    stopCameraSafe();
                    navigate(-1);
                }}
                className="mt-6 px-6 py-2 text-gray-600 hover:text-gray-800"
            >
                ← Quay lại
            </button>
        </div>
    );
};

export default ScanQR;
