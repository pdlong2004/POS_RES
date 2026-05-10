import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserShield, FaTable, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import TableMap from './TableMap';

const StaffHeader = ({ onOpenMap }) => {
    const { isAuthenticated, logout } = useAuth();
    const [showMap, setShowMap] = useState(false);
    const navigate = useNavigate();

    const handleOpenMap = () => {
        if (onOpenMap) {
            onOpenMap();
        } else {
            setShowMap(true);
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-[#4a3728] text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <NavLink to="/staff" className="flex items-center gap-2">
                            <img src="https://manwah.com.vn/images/logo/manwah.svg" className="h-7 w-auto brightness-0 invert" alt="Manwah" />
                            <span className="hidden sm:inline-block font-bold tracking-wider text-sm border-l border-white/20 pl-4">CỔNG NHÂN VIÊN</span>
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <NavLink 
                            to="/" 
                            className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
                            title="Về trang khách hàng"
                        >
                            <FaHome size={18} />
                        </NavLink>

                        <button
                            onClick={handleOpenMap}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-sm font-bold border border-white/10"
                        >
                            <FaTable />
                            <span className="hidden xs:inline">Sơ đồ bàn</span>
                        </button>

                        {isAuthenticated ? (
                            <NavLink
                                to="/admin/dashboard"
                                className="flex items-center gap-2 px-4 py-2 bg-[#C8392B] hover:bg-[#b03226] text-white rounded-full transition-all text-sm font-bold shadow-md"
                            >
                                <FaUserShield />
                                <span className="hidden xs:inline">Bảng điều khiển</span>
                            </NavLink>
                        ) : (
                            <NavLink
                                to="/admin"
                                className="flex items-center gap-2 px-4 py-2 bg-white text-[#4a3728] hover:bg-gray-100 rounded-full transition-all text-sm font-bold"
                            >
                                <FaSignOutAlt />
                                <span>Đăng nhập Admin</span>
                            </NavLink>
                        )}
                    </div>
                </div>
            </header>

            {/* Render local map only if no parent handler is provided */}
            {!onOpenMap && showMap && <TableMap onClose={() => setShowMap(false)} />}
        </>
    );
};

export default StaffHeader;
