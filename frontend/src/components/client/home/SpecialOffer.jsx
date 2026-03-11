import React from 'react';
import { Special as SpecialData } from './data/Special';
import { NavLink } from 'react-router-dom';
import { FaArrowRightLong } from 'react-icons/fa6';

const SpecialOffer = ({ data = SpecialData }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-center mb-15">Special Offer</h2>

            <div>
                {data.map((item, index) => {
                    const totalMedia = (Array.isArray(item.image) ? item.image.length : 0) + (item.video ? 1 : 0);

                    return (
                        <div key={index} className="flex flex-col lg:grid grid-cols-2 gap-8 mb-8  mx-auto max-w-6xl">
                            <div className="p-4 rounded-xl bg-[#fdfdfd] shadow-lg order-2 lg:order-1 font-sans">
                                <h3 className="lg:text-left text-center text-2xl font-bold mb-4">{item.title}</h3>
                                <div className="mb-8">{item.excerpt}</div>
                                <div className="flex items-center justify-center lg:justify-start">
                                    {item.link?.startsWith('http') ? (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block underline underline-from mr-2 text-[#551A8B]"
                                        >
                                            {item.button}
                                        </a>
                                    ) : (
                                        <NavLink
                                            to={item.link}
                                            className="inline-block underline underline-from mr-2 text-[#551A8B]"
                                        >
                                            {item.button}
                                        </NavLink>
                                    )}
                                    <FaArrowRightLong className="text-primary" />
                                </div>
                            </div>

                            <div
                                className={`grid gap-4 ${totalMedia > 1 ? 'grid-cols-2' : 'grid-cols-1'} order-1 lg:order-2`}
                            >
                                {Array.isArray(item.image) &&
                                    item.image.map((img, imgIndex) => (
                                        <img
                                            key={imgIndex}
                                            src={img.url}
                                            alt=""
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    ))}

                                {item.video && (
                                    <iframe
                                        src={item.video}
                                        className="w-full h-full min-h-75 rounded-lg"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SpecialOffer;
