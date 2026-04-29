import { useState, useEffect } from 'react';
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
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const { totalItems } = useCart();

    const tableToken = sessionStorage.getItem('tableToken');
    const tableInfo = JSON.parse(sessionStorage.getItem('tableInfo'));
    const isTableLogin = !!tableToken;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleTableLogout = async () => {
        try {
            if (tableInfo?._id) {
                await axios.post('http://localhost:5001/api/invoices/close', { tableId: tableInfo._id });
                try {
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
            console.error('Error closing invoice on logout', err);
        } finally {
            sessionStorage.removeItem('tableToken');
            sessionStorage.removeItem('tableInfo');
            navigate('/');
        }
    };

    const menuItems = [
        { path: '/', label: 'Trang chủ' },
        { path: '/menu', label: 'Thực Đơn' },
        { path: '/about', label: 'Về Chúng Tôi' },
        { path: '/booking', label: 'Đặt Bàn' },
    ];

    return (
        <>
            <header
                className={`sticky top-0 z-50 w-full transition-all duration-500 ${
                    scrolled
                        ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-[#f5e8d8]'
                        : 'bg-white/90 backdrop-blur-md border-b border-[#f5e8d8]/60'
                }`}
            >
                <div className="flex justify-between items-center px-6 h-[72px] max-w-7xl mx-auto">
                    {/* Logo */}
                    <NavLink to="/" className="group flex items-center gap-2 shrink-0">
                        <img
                            src="https://manwah.com.vn/images/logo/manwah.svg"
                            className="h-9 w-auto group-hover:scale-105 transition-transform duration-300"
                            alt="Manwah Logo"
                        />
                    </NavLink>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end
                                className={({ isActive }) =>
                                    `relative px-4 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 rounded-lg group ${
                                        isActive
                                            ? 'text-[#C8392B]'
                                            : 'text-[#4a3728] hover:text-[#C8392B]'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {item.label}
                                        <span
                                            className={`absolute bottom-0 left-4 right-4 h-0.5 bg-[#C8392B] rounded-full transition-all duration-300 ${
                                                isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                                            }`}
                                        />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Table Info (desktop) */}
                        {isTableLogin && (
                            <div className="hidden lg:flex items-center gap-3 border-r border-[#e8d5c4] pr-4 mr-1">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fdf0e8] rounded-full border border-[#f5d5c0]">
                                    <span className="text-[#C8392B] text-sm">🪑</span>
                                    <span className="text-sm font-bold text-[#C8392B]">
                                        {tableInfo?.name}
                                    </span>
                                </div>
                                <button
                                    onClick={handleTableLogout}
                                    className="text-xs font-bold text-[#8c6a57] hover:text-[#C8392B] transition-colors uppercase tracking-wider"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}

                        {/* Cart & Invoice buttons */}
                        {isTableLogin && (
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => navigate('/orders')}
                                    className="relative p-2.5 rounded-full text-[#8c6a57] hover:bg-[#fdf0e8] hover:text-[#C8392B] transition-colors group"
                                >
                                    <FaCartShopping className="text-xl group-hover:scale-110 transition-transform" />
                                    {totalItems > 0 && (
                                        <span className="absolute top-0.5 right-0 min-w-5 h-5 flex items-center justify-center text-[10px] font-black bg-[#C8392B] text-white rounded-full px-1 border-2 border-white shadow-sm">
                                            {totalItems > 99 ? '99+' : totalItems}
                                        </span>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/invoice')}
                                    className="relative p-2.5 rounded-full text-[#8c6a57] hover:bg-[#fdf0e8] hover:text-[#C8392B] transition-colors group"
                                >
                                    <FaFileInvoice className="text-xl group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        )}

                        {/* Desktop login/map buttons */}
                        {!isTableLogin && (
                            <div className="hidden lg:flex items-center gap-3">
                                <button
                                    onClick={() => setShowMap(true)}
                                    className="px-4 py-2 border border-[#e8d5c4] text-[#4a3728] font-semibold rounded-full hover:bg-[#fdf0e8] hover:border-[#C8392B] hover:text-[#C8392B] transition-all text-sm"
                                >
                                    Sơ đồ bàn
                                </button>
                                <NavLink
                                    to="/scan"
                                    className="mw-btn-primary !py-2 !px-5"
                                >
                                    Quét QR Đăng Nhập
                                </NavLink>
                            </div>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            className="lg:hidden p-2 rounded-xl bg-[#fdf0e8] text-[#C8392B] hover:bg-[#f5d5c0] transition-colors"
                            onClick={() => setMenuActive(!menuActive)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d={menuActive ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div
                    className={`lg:hidden overflow-hidden transition-all duration-300 ${
                        menuActive ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    } bg-white border-t border-[#f5e8d8]`}
                >
                    <ul className="px-4 py-4 space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    end
                                    onClick={() => setMenuActive(false)}
                                    className={({ isActive }) =>
                                        `block px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                                            isActive
                                                ? 'text-[#C8392B] bg-[#fdf0e8]'
                                                : 'text-[#4a3728] hover:text-[#C8392B] hover:bg-[#fdf0e8]'
                                        }`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {isTableLogin ? (
                        <div className="px-4 pb-4 border-t border-[#f5e8d8] pt-3">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fdf0e8] rounded-full border border-[#f5d5c0]">
                                    <span className="text-[#C8392B] text-sm">🪑</span>
                                    <span className="text-sm font-bold text-[#C8392B]">{tableInfo?.name}</span>
                                </div>
                                <button
                                    onClick={() => { handleTableLogout(); setMenuActive(false); }}
                                    className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-wider"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="px-4 pb-4 space-y-2 border-t border-[#f5e8d8] pt-3">
                            <NavLink
                                to="/scan"
                                onClick={() => setMenuActive(false)}
                                className="mw-btn-primary w-full justify-center"
                            >
                                Quét QR Đăng Nhập
                            </NavLink>
                            <button
                                onClick={() => { setShowMap(true); setMenuActive(false); }}
                                className="mw-btn-outline w-full"
                            >
                                Sơ đồ bàn
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {showMap && <TableMap onClose={() => setShowMap(false)} />}
        </>
    );
};

export default Header;

