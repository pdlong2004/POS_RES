import { useState } from 'react';
import axios from 'axios';
import { getStatusTablesApi } from '@/service/statusTable.service';
import { updateTableStatusApi } from '@/service/table.service';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaCartShopping } from 'react-icons/fa6';
import TableMap from './TableMap';
import { useCart } from '../../../context/CartContext';
import { FaFileInvoice } from 'react-icons/fa';

const Header = () => {
    const [menuActive, setMenuActive] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const navigate = useNavigate();
    const { totalItems } = useCart();

    const tableToken = localStorage.getItem('tableToken');
    const tableInfo = JSON.parse(localStorage.getItem('tableInfo'));
    const isTableLogin = !!tableToken;

    const handleTableLogout = async () => {
        // attempt to close pending invoice on server so next login creates a new invoice
        try {
            if (tableInfo?._id) {
                await axios.post('http://localhost:5001/api/invoices/close', { tableId: tableInfo._id });
                try {
                    // set table status to 'empty' for a clean UI
                    const statuses = await getStatusTablesApi();
                    const list = statuses?.data ?? [];
                    const empty = list.find((s) => s.code === 'empty');
                    if (empty) {
                        await updateTableStatusApi(tableInfo._id, empty._id);
                    }
                } catch (e) {
                    console.error('Failed to set table empty on logout', e);
                }
            }
        } catch (err) {
            // ignore errors — still clear client session
            console.error('Error closing invoice on logout', err);
        } finally {
            localStorage.removeItem('tableToken');
            localStorage.removeItem('tableInfo');
            navigate('/');
        }
    };

    const menuItems = [
        { path: '/', label: 'Trang chủ' },
        { path: '/menu', label: 'Menu' },
        { path: '/about', label: 'Về chúng tôi' },
        { path: '/booking', label: 'Đặt bàn' },
    ];

    return (
        <>
            <header className="relative bg-white shadow-md z-30 w-screen">
                <div className="flex justify-between items-center px-5 h-18 mx-auto">
                    <NavLink to="/">
                        <img src="https://manwah.com.vn/images/logo/manwah.svg" width="150" alt="Logo" />
                    </NavLink>

                    <ul
                        className={`absolute top-full left-0 right-0 bg-white text-center shadow-lg
                        lg:static lg:flex lg:shadow-none lg:space-x-8
                        transform origin-top transition-transform duration-300
                        ${menuActive ? 'scale-y-100' : 'scale-y-0'}
                        lg:scale-y-100`}
                    >
                        {menuItems.map((item) => (
                            <li key={item.path} className="py-4 lg:py-0">
                                <NavLink
                                    to={item.path}
                                    end
                                    onClick={() => setMenuActive(false)}
                                    className={({ isActive }) =>
                                        isActive ? 'text-[#F89520]' : 'text-gray-500 hover:text-[#F89520]'
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}

                        {!isTableLogin && (
                            <>
                                <li className="lg:hidden px-4 pb-2">
                                    <NavLink
                                        to="/scan"
                                        onClick={() => setMenuActive(false)}
                                        className="block w-full px-6 py-3 bg-[#F89520] text-white font-semibold text-center"
                                    >
                                        Quét QR đăng nhập bàn
                                    </NavLink>
                                </li>
                                <li className="lg:hidden px-4 pb-4">
                                    <button
                                        onClick={() => {
                                            setShowMap(true);
                                            setMenuActive(false);
                                        }}
                                        className="w-full px-6 py-3 border-2 border-[#F89520] text-[#F89520] font-semibold"
                                    >
                                        Xem sơ đồ bàn
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>

                    <div className="flex items-center gap-4">
                        {isTableLogin && (
                            <div className="hidden lg:flex lg:items-center lg:gap-3">
                                <div className="hidden lg:block text-sm font-semibold text-[#F89520]">
                                    🪑 {tableInfo?.name}
                                </div>
                                <button
                                    onClick={handleTableLogout}
                                    className="hidden lg:inline-block px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-100"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}

                        {isTableLogin && (
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/orders')}
                                    className="relative p-1 rounded-full hover:bg-orange-50 "
                                >
                                    <FaCartShopping className="text-2xl text-[#F89520] cursor-pointer " />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-xs font-bold bg-red-500 text-white rounded-full px-1">
                                            {totalItems > 99 ? '99+' : totalItems}
                                        </span>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/invoice')}
                                    className="relative p-1 rounded-full hover:bg-orange-50"
                                >
                                    <FaFileInvoice className="text-2xl text-[#F89520] cursor-pointer " />
                                </button>
                            </div>
                        )}

                        {!isTableLogin && (
                            <>
                                <NavLink
                                    to="/scan"
                                    className="hidden lg:inline-block px-4 py-2 bg-[#F89520]
                                    rounded-3xl text-white hover:opacity-90 cursor-pointer font-medium"
                                >
                                    Quét QR
                                </NavLink>
                                <button
                                    onClick={() => setShowMap(true)}
                                    className="hidden lg:inline-block px-4 py-2 border-2 border-[#F89520]
                                    rounded-3xl text-[#F89520] hover:bg-orange-50 cursor-pointer font-medium"
                                >
                                    Xem sơ đồ bàn
                                </button>
                            </>
                        )}

                        <button className="lg:hidden" onClick={() => setMenuActive(!menuActive)}>
                            <img
                                src="https://cdn.prod.website-files.com/5be96251aaba7a7b19ecdf69/5be96251aaba7a13f3ecdfa0_Menu%20Icon.png"
                                width="20"
                                alt="Menu"
                            />
                        </button>
                    </div>
                </div>
            </header>

            {showMap && <TableMap onClose={() => setShowMap(false)} />}
        </>
    );
};

export default Header;
