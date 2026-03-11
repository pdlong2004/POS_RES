import InfoCustomer from '@/components/client/Booking/InfoCustomer';
import SetTables from '@/components/client/Booking/SetTables';
import Footer from '@/components/client/shared/Footer';
import Header from '@/components/client/shared/Header';
import React from 'react';

const Booking = () => {
    return (
        <div>
            <Header />
            <div
                className="pt-[15%] relative object-cover object-center bg-no-repeat bg-cover "
                style={{
                    backgroundImage:
                        "url('https://homebbq.thietkewebsitemienphi.com/wp-content/uploads/2018/02/banner-234.jpg')",
                }}
            ></div>
            <div className="py-7.5">
                <div className="space-y-10 [@media(min-width:900px)]:grid grid-cols-2 gap-3 max-w-[80%] mx-auto">
                    <SetTables />
                    <InfoCustomer />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Booking;
