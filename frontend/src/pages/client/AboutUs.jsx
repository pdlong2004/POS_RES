import React from 'react';
import Header from '../../components/client/shared/Header';
import Footer from '../../components/client/shared/Footer';
import Wrap01 from '../../components/client/AboutUs/Wrap01';
import Wrap02 from '../../components/client/AboutUs/Wrap02';
import Wrap03 from './../../components/client/AboutUs/Wrap03';
import Wrap04 from '../../components/client/AboutUs/Wrap04';

const AboutUs = () => {
    return (
        <div className="bg-[#1a0c08]">
            <Header />
            <Wrap01 />
            <Wrap02 />
            <Wrap03 />
            <Wrap04 />
            <Footer />
        </div>
    );
};

export default AboutUs;

