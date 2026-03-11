import { useBookingForm } from '@/hooks/useBookingForm';
import React from 'react';
import TimePicker from './TimePicker';

const InfoCustomer = () => {
    const { formData, errors, loading, successMessage, handleChange, handleTimeSelect, handleSubmit } =
        useBookingForm();

    return (
        <section
            className="relative w-full bg-cover bg-center py-20"
            style={{
                backgroundImage:
                    "url('https://cmsbrandwebsites.ggg.com.vn/wp-content/uploads/2022/12/kham-pha-van-hoa-lau-dem-ve-hot-trend-2023-1024x576.png')",
            }}
        >
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative max-w-6xl mx-auto px-4 font-sans">
                <div className="text-white text-center mb-10">
                    <h2 className="text-4xl font-bold mb-4">Đặt bàn ngay hôm nay !</h2>
                    <p className="text-lg opacity-90">Giữ chỗ trước – phục vụ nhanh – trải nghiệm trọn vẹn hương vị</p>
                </div>
                <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-xl max-w-xl mx-auto">
                    <h3 className="text-2xl font-semibold mb-4 text-center">Thông tin đặt bàn</h3>

                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMessage}</div>
                    )}

                    {errors.submit && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errors.submit}</div>}

                    <form className="space-y-3" onSubmit={handleSubmit}>
                        <input
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            placeholder="Tên của bạn..."
                            className="w-full border rounded px-4 py-2"
                        />
                        {errors.customerName && <p className="text-red-500 text-sm">{errors.customerName}</p>}

                        <input
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            placeholder="Số điện thoại..."
                            className="w-full border rounded px-4 py-2"
                        />

                        <input
                            name="numberOfGuests"
                            type="number"
                            value={formData.numberOfGuests}
                            onChange={handleChange}
                            placeholder="Số người..."
                            className="w-full border rounded px-4 py-2"
                        />

                        <input
                            name="bookingDate"
                            type="date"
                            value={formData.bookingDate}
                            onChange={handleChange}
                            className="w-full border rounded px-4 py-2"
                        />

                        <TimePicker
                            value={formData.bookingTime}
                            onSelect={handleTimeSelect}
                            error={errors.bookingTime}
                        />

                        <button
                            disabled={loading}
                            className="w-full bg-orange-500 text-white py-3 rounded cursor-pointer hover:opacity-90"
                        >
                            {loading ? 'Đang xử lý...' : 'Đặt bàn'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default InfoCustomer;
