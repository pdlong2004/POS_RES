import React, { useState, useEffect } from 'react';
import { useCategory } from '../../../hooks/useCategory';

const Category = ({ onSelect }) => {
    const [activeSlug, setActiveSlug] = useState(null);
    const { categories } = useCategory();

    useEffect(() => {
        if (categories?.length && !activeSlug) {
            setActiveSlug(categories[0].slug);
            onSelect?.(categories[0].slug);
        }
    }, [categories, activeSlug, onSelect]);

    const handleSelect = (slug) => {
        setActiveSlug(slug);
        onSelect?.(slug);
    };

    return (
        <>
            {/* Desktop sidebar */}
            <div className="hidden md:block w-56 shrink-0">
                <div className="bg-white rounded-2xl border border-[#f5e8d8] shadow-sm overflow-hidden">
                    <div className="px-4 py-3.5 bg-[#C8392B] text-white">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-0.5">Danh mục</p>
                        <h3 className="font-bold text-base mw-subheading">Món Lẻ</h3>
                    </div>

                    <ul className="py-2">
                        {categories?.map((category) => (
                            <li key={category._id}>
                                <button
                                    onClick={() => handleSelect(category.slug)}
                                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 group ${
                                        activeSlug === category.slug
                                            ? 'text-[#C8392B] bg-[#fdf0e8] border-r-3 border-[#C8392B] font-bold'
                                            : 'text-[#5a3e30] hover:text-[#C8392B] hover:bg-[#fdf8f5]'
                                    }`}
                                >
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                                            activeSlug === category.slug ? 'bg-[#C8392B]' : 'bg-[#d5bfb4] group-hover:bg-[#C8392B]'
                                        }`}
                                    />
                                    {category.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Mobile horizontal scroll tabs */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 w-full z-40 bg-[#1a0c08]/95 backdrop-blur-sm border-t border-white/10 shadow-2xl">
                <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
                    {categories?.map((category) => (
                        <button
                            key={category._id}
                            onClick={() => handleSelect(category.slug)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold shrink-0 transition-all duration-200 ${
                                activeSlug === category.slug
                                    ? 'bg-[#C8392B] text-white shadow-lg shadow-[#C8392B]/30'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Category;

