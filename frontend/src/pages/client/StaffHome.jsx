import React, { useState } from 'react';
import StaffHeader from '../../components/client/shared/StaffHeader';
import Footer from '../../components/client/shared/Footer';
import { FaUsersCog, FaTable, FaShieldAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import TableMap from '../../components/client/shared/TableMap';

const StaffHome = () => {
    const [showMap, setShowMap] = useState(false);

    return (
        <div className="min-h-screen bg-[#fffaf6] flex flex-col">
            <StaffHeader onOpenMap={() => setShowMap(true)} />

            <main className="flex-grow flex items-center justify-center p-6">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#fdf0e8] text-[#C8392B] mb-6 shadow-sm border border-[#f5d5c0]">
                            <FaUsersCog size={40} />
                        </div>
                        <h1 className="text-4xl font-black text-[#3d2314] mb-4 tracking-tight">
                            Cổng Thông Tin Nhân Viên
                        </h1>
                        <p className="text-[#8c6a57] text-lg max-w-2xl mx-auto">
                            Chào mừng bạn đến với hệ thống quản lý Manwah. Vui lòng sử dụng các chức năng trên thanh
                            điều hướng hoặc truy cập nhanh bên dưới.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-3xl border border-[#f5e8d8] shadow-sm hover:shadow-xl hover:border-[#C8392B]/30 transition-all duration-500 group">
                            <div className="w-14 h-14 rounded-2xl bg-[#fdf0e8] text-[#C8392B] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <FaTable size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-[#3d2314] mb-3">Sơ đồ bàn</h3>
                            <p className="text-[#8c6a57] text-sm mb-6 leading-relaxed">
                                Kiểm tra trạng thái bàn, quản lý khách hàng và theo dõi đơn hàng trực tiếp tại cửa hàng.
                            </p>
                            <button
                                onClick={() => setShowMap(true)}
                                className="text-[#C8392B] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
                            >
                                Mở sơ đồ bàn <span>→</span>
                            </button>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-[#f5e8d8] shadow-sm hover:shadow-xl hover:border-[#C8392B]/30 transition-all duration-500 group">
                            <div className="w-14 h-14 rounded-2xl bg-[#4a3728] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <FaShieldAlt size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-[#3d2314] mb-3">Hệ thống Quản trị</h3>
                            <p className="text-[#8c6a57] text-sm mb-6 leading-relaxed">
                                Đăng nhập vào trang quản trị để quản lý doanh thu, thực đơn, nhân sự và báo cáo.
                            </p>
                            <NavLink
                                to="/admin"
                                className="text-[#4a3728] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
                            >
                                Đến trang đăng nhập <span>→</span>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Render TableMap controlled by StaffHome state */}
            {showMap && <TableMap onClose={() => setShowMap(false)} />}
        </div>
    );
};

export default StaffHome;
