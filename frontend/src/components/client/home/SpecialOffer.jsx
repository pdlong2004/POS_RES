import React from 'react';
import { Special as SpecialData } from './data/Special';
import { NavLink } from 'react-router-dom';
import { FaArrowRightLong } from 'react-icons/fa6';

const SpecialOffer = ({ data = SpecialData }) => {
    return (
        <section className="mw-section-bg-warm mw-pattern-bg py-16">
            <div className="max-w-6xl mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-14">
                    <p className="mw-tag mb-3">Ưu Đãi Đặc Biệt</p>
                    <h2 className="mw-section-title text-[#3d2314]">
                        <em>Special Offer</em>
                    </h2>
                    <div className="mw-section-divider mw-divider-ornament mt-4">
                        <span className="text-[#C8392B] text-xl">❧</span>
                    </div>
                </div>

                {/* Offers list */}
                <div className="space-y-16">
                    {data.map((item, index) => {
                        const totalMedia =
                            (Array.isArray(item.image) ? item.image.length : 0) + (item.video ? 1 : 0);
                        const isReversed = index % 2 !== 0;

                        return (
                            <div
                                key={index}
                                className={`flex flex-col lg:grid grid-cols-2 gap-10 lg:gap-16 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}
                            >
                                {/* Text */}
                                <div
                                    className={`p-8 rounded-3xl bg-white border border-[#f5e8d8] shadow-md order-2 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}
                                >
                                    <span className="mw-tag block mb-3">Ưu đãi</span>
                                    <h3 className="text-2xl lg:text-3xl font-bold text-[#3d2314] mb-4 mw-subheading leading-snug">
                                        {item.title}
                                    </h3>
                                    <p className="text-[#8c6a57] leading-relaxed mb-8">{item.excerpt}</p>

                                    <div className="flex items-center gap-3">
                                        {item.link?.startsWith('http') ? (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mw-btn-primary group"
                                            >
                                                {item.button}
                                                <FaArrowRightLong className="group-hover:translate-x-1 transition-transform" />
                                            </a>
                                        ) : (
                                            <NavLink
                                                to={item.link}
                                                className="mw-btn-primary group"
                                            >
                                                {item.button}
                                                <FaArrowRightLong className="group-hover:translate-x-1 transition-transform" />
                                            </NavLink>
                                        )}
                                    </div>
                                </div>

                                {/* Media */}
                                <div
                                    className={`grid gap-4 ${totalMedia > 1 ? 'grid-cols-2' : 'grid-cols-1'} order-1 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}
                                >
                                    {Array.isArray(item.image) &&
                                        item.image.map((img, imgIndex) => (
                                            <div
                                                key={imgIndex}
                                                className="rounded-2xl overflow-hidden shadow-lg group"
                                            >
                                                <img
                                                    src={img.url}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        ))}

                                    {item.video && (
                                        <div className="rounded-2xl overflow-hidden shadow-lg">
                                            <iframe
                                                src={item.video}
                                                className="w-full min-h-72 lg:min-h-80"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default SpecialOffer;

