import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="bg-gray-900 pb-4">
            <div className=" mx-auto max-w-6xl flex flex-col space-y-3 lg:grid grid-cols-[5fr_2fr_3fr] gap-5 py-8 text-white border-b border-white mb-4">
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                    <NavLink to="/" className="cursor-pointer">
                        <img
                            src="https://manwah.com.vn/images/logo/manwah.svg"
                            width="150"
                            alt="Logo"
                            className="object-contain"
                        />
                    </NavLink>

                    <div className="mb-4">
                        Manwah là tín đồ ẩm thực cho những tín đồ yêu thích lẩu . Với đa dạng các loại nước lẩu đặc
                        trưng của Đài Loan, kết hợp cùng vô vàn món nhúng tươi ngon, Manwah mang đến một trải nghiệm ẩm
                        thực khó quên. Mỗi ngụm lẩu đều là một hành trình khám phá hương vị độc đáo, từ vị cay nồng đặc
                        trưng của lẩu Mala đến vị thanh ngọt của lẩu nấm
                    </div>

                    <div className="flex gap-4 cursor-pointer">
                        <NavLink>
                            <FaFacebook />
                        </NavLink>

                        <NavLink>
                            <FaInstagram />
                        </NavLink>

                        <NavLink>
                            <FaTwitter />
                        </NavLink>
                    </div>
                </div>
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                    <div className="font-bold text-2xl mb-6">Quick Links</div>
                    <ul className="flex flex-col gap-3 cursor-pointer">
                        <NavLink className="hover:text-primary hover:underline hover:underline-primary">
                            Trang chủ
                        </NavLink>
                        <NavLink className="hover:text-primary hover:underline hover:underline-primary">Menu</NavLink>
                        <NavLink className="hover:text-primary hover:underline hover:underline-primary">
                            Về chúng tôi
                        </NavLink>
                        <NavLink className="hover:text-primary hover:underline hover:underline-primary">
                            Liên hệ
                        </NavLink>
                    </ul>
                </div>
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                    <div className="font-bold text-2xl mb-6">Liên hệ</div>
                    <p className="mb-4">
                        Trụ sở chính: Số 60 Phố Giang Văn Minh, Phường Đội Cấn, Quận Ba Đình, Thành phố Hà Nội, Việt Nam
                    </p>
                    <p className="mb-4">GPĐK: 0102721191 cấp ngày 09/04/2008</p>
                    <div>
                        <p>ĐT: 043 222 3000</p>
                        <p> Email: support.hn@ggg.com.vn</p>
                    </div>
                </div>
            </div>

            <div className="text-white text-center">© 2011 Golden Gate ., JSC. All rights reserved</div>
        </div>
    );
};

export default Footer;
