import React, { useState, useEffect } from 'react';
import Header from '../../components/client/shared/Header';
import Footer from '../../components/client/shared/Footer';
import Category from '../../components/client/menu/Category';
import ShowProduct from '../../components/client/menu/ShowProduct';
import { useParams } from 'react-router-dom';
import useProductsByCategory from '../../hooks/useProductsByCategory';
import Loading from '../../components/client/shared/Loading';

const Menu = () => {
    const { slug } = useParams();
    const [activeSlug, setActiveSlug] = useState(slug || null);

    useEffect(() => {
        if (slug) setActiveSlug(slug);
    }, [slug]);

    const { products, loading } = useProductsByCategory(activeSlug);

    return (
        <div className="min-h-screen flex flex-col bg-[#fffaf6]">
            <Header />

            {/* Page hero */}
            <div className="bg-[#1a0c08] text-white py-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <p className="mw-tag text-[#F89520] mb-1">Khám phá</p>
                    <h1 className="text-3xl md:text-4xl font-bold mw-subheading">
                        <em>Thực Đơn</em>
                    </h1>
                    <p className="text-white/50 mt-1 text-sm">Lẩu Đài Loan đặc sắc & các món nhúng tươi ngon</p>
                </div>
            </div>

            <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex gap-8">
                {/* Sidebar */}
                <Category onSelect={setActiveSlug} />

                {/* Products */}
                <div className="flex-1 min-w-0 pb-20 md:pb-0">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-64">
                            <div className="text-center">
                                <div className="inline-block w-12 h-12 border-3 border-[#C8392B] border-t-transparent rounded-full animate-spin mb-3" />
                                <p className="text-[#8c6a57] text-sm">Đang tải thực đơn...</p>
                            </div>
                        </div>
                    ) : products?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="text-5xl mb-4">🍲</div>
                            <h3 className="font-bold text-[#3d2314] text-lg mb-2">Chưa có món trong danh mục này</h3>
                            <p className="text-[#8c6a57] text-sm">Vui lòng chọn danh mục khác</p>
                        </div>
                    ) : (
                        <ShowProduct products={products} />
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Menu;

