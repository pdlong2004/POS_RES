import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loginByQRCodeApi } from '../../service/tableAuth.service';
import { useToast } from '../../context/ToastContext';
import CustomSwiper from '../../components/client/shared/CustomSwiper';

const LOADING_SLIDES = [
    { text: 'Đang xác thực bàn...', sub: 'Vui lòng đợi trong giây lát' },
    { text: 'Đang kết nối...', sub: 'Hệ thống đang xử lý' },
    { text: 'Sắp xong...', sub: 'Chuẩn bị vào thực đơn' },
];

const TableLogin = () => {
    const { id: tableId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const rawId = tableId?.trim();
        if (!rawId) {
            showToast('QR không hợp lệ', 'error');
            navigate('/', { replace: true });
            return;
        }

        const loginTable = async () => {
            setLoading(true);
            try {
                const res = await loginByQRCodeApi(rawId);

                const token = res?.data?.token;
                const table = res?.data?.table;
                if (!token || !table) {
                    showToast('Phản hồi từ server không hợp lệ', 'error');
                    setLoading(false);
                    navigate('/', { replace: true });
                    return;
                }

                sessionStorage.setItem('tableToken', token);
                sessionStorage.setItem('tableInfo', JSON.stringify(table));

                navigate('/menu', { replace: true });
            } catch (error) {
                console.error('Table login error:', error);
                const msg =
                    error?.response?.data?.message ||
                    (error?.code === 'ERR_NETWORK'
                        ? 'Không kết nối được server. Kiểm tra backend (port 5001).'
                        : 'QR không hợp lệ hoặc bàn không tồn tại');
                showToast(msg, 'error');
                setLoading(false);
                navigate('/', { replace: true });
            }
        };

        loginTable();
    }, [tableId, navigate, showToast]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a0c08] flex flex-col items-center justify-center px-6">
                {/* Logo */}
                <img
                    src="https://manwah.com.vn/images/logo/manwah.svg"
                    alt="Manwah"
                    className="h-12 w-auto brightness-0 invert mb-12 opacity-80"
                />

                {/* Spinner */}
                <div className="relative mb-8">
                    <div className="w-20 h-20 border-4 border-white/10 rounded-full" />
                    <div className="absolute inset-0 w-20 h-20 border-4 border-[#C8392B] border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-3 w-14 h-14 border-4 border-[#F89520]/30 border-b-transparent rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                </div>

                {/* Slides */}
                <div className="w-full max-w-sm">
                    <CustomSwiper
                        items={LOADING_SLIDES}
                        renderSlide={(slide) => (
                            <div className="text-center py-4 px-4">
                                <p className="text-xl font-bold text-white mw-subheading">{slide.text}</p>
                                <p className="text-white/50 mt-2 text-sm">{slide.sub}</p>
                            </div>
                        )}
                        autoPlay={true}
                        delay={2000}
                    />
                </div>

                {/* Decorative dots */}
                <div className="flex gap-2 mt-8">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-[#C8392B]/50 animate-pulse"
                            style={{ animationDelay: `${i * 0.3}s` }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

export default TableLogin;

