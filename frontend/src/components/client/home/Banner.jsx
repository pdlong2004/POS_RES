import React from 'react';
import CustomSwiper from './../shared/CustomSwiper';
import { NavLink } from 'react-router-dom';

const Banner = () => {
    const images = [
        { url: 'https://brand-pcms.ggg.systems/media/so/homecmsdata/banners/1500x700_1.png' },
        {
            url: 'https://brand-pcms.ggg.systems/media/so/homecmsdata/banners/MW_-_Menuboard_Adapt_online-t12026__1500W_x_700H_px_190126_1_.jpg',
        },
    ];

    return (
        <section className="w-full mw-section-bg">
            {/* Hero Swiper */}
            <div className="w-full max-w-6xl mx-auto px-4 pt-6 pb-4">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                    <CustomSwiper
                        items={images}
                        autoPlay
                        delay={4500}
                        renderSlide={(img, index) => (
                            <div className="relative">
                                <img
                                    key={index}
                                    src={img.url}
                                    alt="Banner Manwah"
                                    className="w-full object-cover"
                                />
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* Sub banner */}
            <div className="w-full max-w-6xl mx-auto px-4 pb-8">
                <NavLink to="/menu">
                    <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
                        <img
                            src="https://cmsbrandwebsites.ggg.com.vn/wp-content/uploads/2026/01/MW-Banner-web-190126-2-scaled.jpg"
                            alt="Khám phá menu Manwah"
                            className="w-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                        />
                    </div>
                </NavLink>
            </div>

            {/* Feature badges */}
            <div className="max-w-6xl mx-auto px-4 pb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: '🍲', title: 'Lẩu Đài Loan', desc: 'Chính thống, đặc sắc' },
                        { icon: '🥩', title: 'Nguyên liệu tươi', desc: 'Nhập mỗi ngày' },
                        { icon: '🍜', title: 'Đa dạng nước lẩu', desc: 'Hơn 10 loại nước lẩu' },
                        { icon: '⭐', title: 'Phục vụ tận tâm', desc: 'Không giới hạn thời gian' },
                    ].map((feat) => (
                        <div
                            key={feat.title}
                            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#f5e8d8] shadow-sm hover:shadow-md hover:border-[#f5d5c0] transition-all duration-300"
                        >
                            <span className="text-2xl shrink-0">{feat.icon}</span>
                            <div>
                                <p className="font-bold text-[#3d2314] text-sm">{feat.title}</p>
                                <p className="text-[#8c6a57] text-xs">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Banner;

