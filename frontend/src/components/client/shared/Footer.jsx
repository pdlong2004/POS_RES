import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa6';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-[#1a0c08] text-white">
            {/* Top decorative border */}
            <div className="h-1 bg-gradient-to-r from-[#C8392B] via-[#F89520] to-[#C8392B]" />

            <div className="max-w-6xl mx-auto px-6 py-14">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 border-b border-white/10 pb-12">
                    {/* Brand */}
                    <div>
                        <NavLink to="/" className="inline-block mb-5">
                            <img
                                src="https://manwah.com.vn/images/logo/manwah.svg"
                                width="140"
                                alt="Manwah Logo"
                                className="object-contain brightness-0 invert"
                            />
                        </NavLink>
                        <p className="text-white/60 text-sm leading-relaxed mb-6">
                            Manwah là điểm đến ẩm thực cho những tín đồ yêu thích lẩu Đài Loan. Với đa dạng các loại nước lẩu đặc trưng, kết hợp cùng vô vàn món nhúng tươi ngon, Manwah mang đến trải nghiệm khó quên.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: <FaFacebook size={18} />, href: '#', label: 'Facebook' },
                                { icon: <FaInstagram size={18} />, href: '#', label: 'Instagram' },
                                { icon: <FaYoutube size={18} />, href: '#', label: 'YouTube' },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-[#C8392B] hover:text-white transition-all duration-300"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-base uppercase tracking-widest text-[#F89520] mb-5">
                            Điều hướng
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { to: '/', label: 'Trang chủ' },
                                { to: '/menu', label: 'Thực đơn' },
                                { to: '/about', label: 'Về chúng tôi' },
                                { to: '/booking', label: 'Đặt bàn' },
                                { to: '/scan', label: 'Quét QR đặt món' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <NavLink
                                        to={link.to}
                                        className="text-white/60 hover:text-[#F89520] transition-colors text-sm flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8392B]/50 group-hover:bg-[#F89520] transition-colors" />
                                        {link.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-base uppercase tracking-widest text-[#F89520] mb-5">
                            Liên hệ
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-white/60">
                                <FaMapMarkerAlt className="text-[#C8392B] mt-0.5 shrink-0" />
                                <span>Số 60 Phố Giang Văn Minh, Phường Đội Cấn, Quận Ba Đình, Hà Nội</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-white/60">
                                <FaPhoneAlt className="text-[#C8392B] shrink-0" />
                                <a href="tel:0432223000" className="hover:text-[#F89520] transition-colors">
                                    043 222 3000
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-white/60">
                                <FaEnvelope className="text-[#C8392B] shrink-0" />
                                <a href="mailto:support.hn@ggg.com.vn" className="hover:text-[#F89520] transition-colors">
                                    support.hn@ggg.com.vn
                                </a>
                            </li>
                        </ul>

                        {/* Hours */}
                        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#F89520] mb-2">Giờ mở cửa</p>
                            <p className="text-sm text-white/60">Thứ 2 – Chủ nhật</p>
                            <p className="text-sm text-white font-semibold">10:00 – 22:00</p>
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-xs">
                        © 2011 Golden Gate., JSC. All rights reserved.
                    </p>
                    <p className="text-white/40 text-xs">
                        GPĐK: 0102721191 cấp ngày 09/04/2008
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

