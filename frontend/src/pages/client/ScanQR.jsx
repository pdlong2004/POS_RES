import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { useToast } from '../../context/ToastContext';

const ScanQR = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const qrInstanceRef = useRef(null);
    const scannedRef = useRef(false);

    const stopCameraSafe = async () => {
        if (qrInstanceRef.current) {
            try {
                // Check if it's currently scanning before attempting to stop
                if (qrInstanceRef.current.isScanning) {
                    await qrInstanceRef.current.stop();
                }
                // Aggressive cleanup: clear the element and reset the instance
                qrInstanceRef.current.clear();
            } catch (err) {
                console.warn('Silent cleanup error:', err);
            } finally {
                qrInstanceRef.current = null;
            }
        }
        
        // Final fallback: remove any lingering video elements from the DOM if library failed to do so
        const reader = document.getElementById('qr-reader');
        if (reader) {
            const video = reader.querySelector('video');
            if (video) {
                const tracks = video.srcObject?.getTracks?.() || [];
                tracks.forEach(track => track.stop());
                video.remove();
            }
            reader.innerHTML = '';
        }
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

            // IMMEDIATELY stop camera before navigating
            await stopCameraSafe();
            navigate(`/table-login/${tableId}`, { replace: true });
        };

        const startCamera = async () => {
            await stopCameraSafe();

            try {
                const qr = new Html5Qrcode('qr-reader');
                qrInstanceRef.current = qr;

                await qr.start(
                    { facingMode: 'environment' },
                    { 
                        fps: 15, 
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0 
                    },
                    onScanSuccess,
                    () => {} // Silent error handler for each frame
                );
            } catch (err) {
                console.error('Camera start error:', err);
                if (!err.toString().includes("is already scanning")) {
                    showToast('Không thể mở camera. Vui lòng kiểm tra quyền truy cập.', 'error');
                }
            }
        };

        const timer = setTimeout(startCamera, 500);

        return () => {
            clearTimeout(timer);
            stopCameraSafe();
        };
    }, [navigate, showToast]);

    return (
        <div className="min-h-screen bg-[#fffaf6] flex flex-col items-center justify-center p-6 overflow-hidden">
            <div className="w-full max-w-md mb-8 text-center animate-fadeIn">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#C8392B] text-white mb-6 shadow-2xl shadow-[#C8392B]/30 rotate-3">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m0 11v1m8-8h-1m-15 0H4m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-black text-[#3d2314] mb-4 tracking-tight leading-tight">
                    Quét Mã QR
                </h1>
                <p className="text-[#8c6a57] text-lg leading-relaxed px-4 opacity-80">
                    Hướng camera về phía mã QR tại bàn của bạn để đăng nhập nhanh chóng.
                </p>
            </div>

            <div className="w-full max-w-sm relative group">
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white bg-black aspect-square transition-transform duration-500 group-hover:scale-[1.02]">
                    <div id="qr-reader" className="w-full h-full object-cover scale-110" />
                    
                    <div className="absolute inset-0 pointer-events-none z-10">
                        <div className="absolute inset-0 border-[60px] border-black/50" />
                        
                        {/* Corners */}
                        <div className="absolute top-[40px] left-[40px] w-16 h-16 border-t-6 border-l-6 border-[#C8392B] rounded-tl-2xl" />
                        <div className="absolute top-[40px] right-[40px] w-16 h-16 border-t-6 border-r-6 border-[#C8392B] rounded-tr-2xl" />
                        <div className="absolute bottom-[40px] left-[40px] w-16 h-16 border-b-6 border-l-6 border-[#C8392B] rounded-bl-2xl" />
                        <div className="absolute bottom-[40px] right-[40px] w-16 h-16 border-b-6 border-r-6 border-[#C8392B] rounded-br-2xl" />
                        
                        <div className="absolute top-[60px] left-[60px] right-[60px] h-1.5 bg-[#C8392B] shadow-[0_0_25px_rgba(200,57,43,1)] animate-scanLine rounded-full opacity-80" />
                    </div>
                </div>

                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C8392B]/10 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#4a3728]/10 rounded-full blur-3xl -z-10" />
            </div>

            <button
                type="button"
                onClick={async () => {
                    await stopCameraSafe();
                    navigate(-1);
                }}
                className="mt-16 flex items-center gap-3 text-[#8c6a57] hover:text-[#C8392B] transition-all font-black uppercase tracking-[0.2em] text-xs bg-white py-4 px-8 rounded-full shadow-md hover:shadow-xl active:scale-95"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
            </button>
        </div>
    );
};

export default ScanQR;



