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
            const tableId =
                match?.[1] ||
                (/^[a-f0-9]{24}$/i.test(decodedText.trim()) ? decodedText.trim() : null);

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
        <div className="min-h-screen bg-[#fffaf6] flex flex-col items-center justify-center p-6">
            {/* Header card */}
            <div className="w-full max-w-md mb-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C8392B] text-white mb-4 shadow-lg shadow-[#C8392B]/30">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                        <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
                        <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
                        <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 14h2m0 0h3m-3 0v2m0 3h3m-7 0h2" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-[#3d2314] mw-subheading mb-2">
                    Quét mã QR tại bàn
                </h1>
                <p className="text-[#8c6a57] text-sm leading-relaxed">
                    Đưa camera vào mã QR trên bàn để đăng nhập và bắt đầu gọi món
                </p>
            </div>

            {/* QR Scanner box */}
            <div className="w-full max-w-sm">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                    <div
                        id="qr-reader"
                        className="w-full aspect-square bg-[#1a0c08]"
                    />
                    {/* Corner accents */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-4 left-4 w-8 h-8 border-t-3 border-l-3 border-[#C8392B] rounded-tl-lg" />
                        <div className="absolute top-4 right-4 w-8 h-8 border-t-3 border-r-3 border-[#C8392B] rounded-tr-lg" />
                        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-3 border-l-3 border-[#C8392B] rounded-bl-lg" />
                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-3 border-r-3 border-[#C8392B] rounded-br-lg" />
                        {/* Scan line */}
                        <div className="absolute left-8 right-8 h-0.5 bg-[#C8392B]/70 top-1/2 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Hint */}
            <p className="mt-6 text-xs text-[#b89c8a] text-center max-w-xs">
                Giữ điện thoại ổn định và đảm bảo ánh sáng đủ để quét mã QR
            </p>

            {/* Back button */}
            <button
                type="button"
                onClick={() => {
                    stopCameraSafe();
                    navigate(-1);
                }}
                className="mt-6 flex items-center gap-2 text-sm text-[#8c6a57] hover:text-[#C8392B] transition-colors font-semibold"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
            </button>
        </div>
    );
};

export default ScanQR;

