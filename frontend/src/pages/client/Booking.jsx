import InfoCustomer from '@/components/client/Booking/InfoCustomer';
import SetTables from '@/components/client/Booking/SetTables';
import Footer from '@/components/client/shared/Footer';
import Header from '@/components/client/shared/Header';
import React from 'react';

const Booking = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#fffaf6]">
            <Header />

            {/* Hero Banner */}
            <div
                className="relative h-72 md:h-96 bg-cover bg-center flex items-center justify-center"
                style={{
                    backgroundImage:
                        "url('https://homebbq.thietkewebsitemienphi.com/wp-content/uploads/2018/02/banner-234.jpg')",
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

                {/* Content */}
                <div className="relative text-center text-white px-6">
                    <p className="mw-tag text-[#F89520] mb-3">Đặt chỗ trước</p>
                    <h1 className="text-4xl md:text-5xl font-bold mw-subheading mb-3">
                        <em>Đặt Bàn</em>
                    </h1>
                    <p className="text-white/70 text-sm max-w-md mx-auto">
                        Trải nghiệm ẩm thực Đài Loan đặc sắc cùng những người thân yêu
                    </p>
                </div>
            </div>

            {/* Booking form section */}
            <div className="flex-1 py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Section header */}
                    <div className="text-center mb-10">
                        <p className="mw-tag mb-2">Thông tin đặt bàn</p>
                        <h2 className="mw-section-title text-[#3d2314]">
                            Chọn bàn &amp; Thông tin khách hàng
                        </h2>
                        <div className="mw-section-divider mw-divider-ornament mt-3">
                            <span className="text-[#C8392B] text-xl">❧</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <SetTables />
                        <InfoCustomer />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Booking;

