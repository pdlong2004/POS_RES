import React from 'react';
import Header from '../../components/client/shared/Header';
import Banner from '../../components/client/home/Banner';
import SpecialOffer from '../../components/client/home/SpecialOffer';
import Footer from '../../components/client/shared/Footer';

const Home = () => {
    return (
        <div>
            <Header />
            <Banner />
            <SpecialOffer />
            <Footer />
        </div>
    );
};

export default Home;
