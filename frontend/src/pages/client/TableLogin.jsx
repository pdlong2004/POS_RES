import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loginByQRCodeApi } from '../../service/tableAuth.service';
import { useToast } from '../../context/ToastContext';
import CustomSwiper from '../../components/client/shared/CustomSwiper';

const LOADING_SLIDES = [
    { text: 'Đang xác thực bàn...', sub: 'Vui lòng đợi trong giây lát' },
    { text: 'Đang kết nối...', sub: 'Hệ thống đang xử lý' },
    { text: 'Sắp xong...', sub: 'Chuẩn bị vào menu' },
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

                localStorage.setItem('tableToken', token);
                localStorage.setItem('tableInfo', JSON.stringify(table));

                navigate('/menu', { replace: true });
            } catch (error) {
                console.error('Table login error:', error);
                const msg =
                    error?.response?.data?.message ||
                    (error?.code === 'ERR_NETWORK' ? 'Không kết nối được server. Kiểm tra backend (port 5001).' : 'QR không hợp lệ hoặc bàn không tồn tại');
                showToast(msg, 'error');
                setLoading(false);
                navigate('/', { replace: true });
            }
        };

        loginTable();
    }, [tableId, navigate, showToast]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center bg-gray-50 px-4">
                <div className="w-full max-w-xl mx-auto">
                    <CustomSwiper
                        items={LOADING_SLIDES}
                        renderSlide={(slide) => (
                            <div className="text-center py-12 px-4">
                                <div className="inline-block w-12 h-12 border-4 border-[#F89520] border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-xl font-semibold text-gray-800">{slide.text}</p>
                                <p className="text-gray-500 mt-1">{slide.sub}</p>
                            </div>
                        )}
                        autoPlay={true}
                        delay={2000}
                    />
                </div>
            </div>
        );
    }

    return null;
};

export default TableLogin;
