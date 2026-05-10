import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaQrcode, FaChevronRight, FaUserShield } from 'react-icons/fa';

const CustomerLanding = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#fffaf6] flex flex-col relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C8392B]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4a3728]/5 rounded-full blur-3xl" />

            {/* Simple Header */}
            <header className="p-6 flex justify-between items-center z-20">
                <NavLink to="/">
                    <img src="https://manwah.com.vn/images/logo/manwah.svg" className="h-10 w-auto" alt="Manwah Logo" />
                </NavLink>
                <button
                    onClick={() => navigate('/staff')}
                    className="p-3 rounded-full bg-white border border-[#f5e8d8] text-[#8c6a57] hover:text-[#C8392B] shadow-sm transition-all"
                    title="Cổng nhân viên"
                >
                    <FaUserShield size={20} />
                </button>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center p-6 z-10">
                <div className="max-w-md w-full text-center">
                    <div className="mb-10 animate-bounce-slow">
                        <div className="inline-flex items-center justify-center w-28 h-28 rounded-[2.5rem] bg-[#C8392B] text-white shadow-2xl shadow-[#C8392B]/30 rotate-3 transform transition hover:rotate-0">
                            <FaQrcode size={56} />
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-[#3d2314] mb-4 tracking-tight leading-tight px-4">
                        Chào mừng bạn đến với <span className="text-[#C8392B]">Manwah</span>
                    </h1>

                    <p className="text-[#8c6a57] text-lg mb-12 leading-relaxed px-6">
                        Để bắt đầu hành trình ẩm thực, vui lòng quét mã QR có sẵn tại bàn của bạn.
                    </p>

                    <button
                        onClick={() => navigate('/scan')}
                        className="w-full py-6 px-8 bg-[#C8392B] text-white text-2xl font-bold rounded-3xl shadow-xl shadow-[#C8392B]/20 hover:bg-[#b03226] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-4 group"
                    >
                        <span>Quét Mã QR Ngay</span>
                        <FaChevronRight className="group-hover:translate-x-2 transition-transform" />
                    </button>

                    <NavLink
                        to="/home"
                        className="mt-12 inline-flex items-center gap-2 text-[#8c6a57] hover:text-[#C8392B] font-bold text-sm transition-colors"
                    >
                        Khám phá thêm về chúng tôi <FaChevronRight size={10} />
                    </NavLink>
                </div>
            </main>

            <footer className="p-8 text-center text-[#b89c8a] text-sm z-10">
                © 2024 Manwah Taiwanese Hotpot. All rights reserved.
            </footer>
        </div>
    );
};

export default CustomerLanding;
