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
        <div className="min-h-screen w-screen flex flex-col bg-gray-50">
            <Header />

            <div className="w-screen mx-auto px-4 grid md:grid-cols-[2fr_8fr] gap-8 my-10">
                <div className="order-2 md:order-1">
                    <Category onSelect={setActiveSlug} />
                </div>

                <div className="order-1 md:order-2">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-75">
                            <Loading size={48} />
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
