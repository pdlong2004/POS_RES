import { QrReader } from 'react-qr-reader';
import axios from 'axios';

const ScanQR = () => {
    const handleResult = async (result) => {
        if (!result) return;

        try {
            const data = JSON.parse(result.text);

            if (data.action !== 'login') {
                alert('QR không hợp lệ');
                return;
            }

            const res = await axios.post('http://localhost:5000/api/table-auth/login-qr', { tableId: data.tableId });

            localStorage.setItem('tableToken', res.data.token);
            localStorage.setItem('tableInfo', JSON.stringify(res.data.table));

            window.location.href = `/table/${data.tableId}`;
        } catch (error) {
            alert('Không thể đăng nhập bàn');
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4">Quét mã QR tại bàn</h2>

            <div className="w-75">
                <QrReader constraints={{ facingMode: 'environment' }} onResult={handleResult} />
            </div>
        </div>
    );
};

export default ScanQR;
