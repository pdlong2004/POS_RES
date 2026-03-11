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
            <div className="hidden md:block w-64">
                <div className="text-lg font-bold pb-2.5 text-orange-500 border-b-2 border-orange-500">Món Lẻ</div>

                <ul className="pt-2.5 text-sm font-medium text-gray-600">
                    {categories?.map((category) => (
                        <li
                            key={category._id}
                            onClick={() => handleSelect(category.slug)}
                            className={`py-3 pl-4 cursor-pointer transition
                                hover:text-orange-500
                                ${
                                    activeSlug === category.slug
                                        ? 'text-orange-500 bg-orange-50 border-l-4 border-orange-500'
                                        : ''
                                }`}
                        >
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="md:hidden fixed bottom-0 left-0 right-0 w-screen bg-[#000000b3] z-40">
                <div className="flex gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
                    {categories?.map((category) => (
                        <button
                            key={category._id}
                            onClick={() => handleSelect(category.slug)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold
                                transition
                                ${activeSlug === category.slug ? ' text-orange-500 ' : ' text-white '}`}
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
