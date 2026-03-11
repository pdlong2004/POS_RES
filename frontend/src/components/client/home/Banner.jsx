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
        <div className="lg:max-w-5xl mx-auto mt-3 mb-15">
            <CustomSwiper
                items={images}
                autoPlay
                delay={4500}
                renderSlide={(img, index) => (
                    <div>
                        <img key={index} src={img.url} alt="Banner" className="w-full object-cover rounded-2xl" />
                    </div>
                )}
            />
            <NavLink>
                <img
                    src="https://cmsbrandwebsites.ggg.com.vn/wp-content/uploads/2026/01/MW-Banner-web-190126-2-scaled.jpg"
                    alt=""
                />
            </NavLink>
        </div>
    );
};

export default Banner;
