import { useBookingForm } from '@/hooks/useBookingForm';
import React from 'react';
import TimePicker from './TimePicker';

const InfoCustomer = () => {
    const { formData, errors, loading, successMessage, handleChange, handleTimeSelect, handleSubmit } =
        useBookingForm();

    return (
        <div className="bg-white rounded-3xl border border-[#f5e8d8] shadow-md overflow-hidden">
            {/* Card header */}
            <div className="bg-[#C8392B] px-6 py-5 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Bước 2</p>
                <h3 className="text-xl font-bold mw-subheading">Thông Tin Đặt Bàn</h3>
            </div>

            <div className="p-6">
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <p className="text-sm font-medium">{successMessage}</p>
                    </div>
                )}

                {errors.submit && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">⚠</span>
                        <p className="text-sm font-medium">{errors.submit}</p>
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="text-xs font-bold text-[#8c6a57] uppercase tracking-widest mb-1.5 block">
                            Họ và tên
                        </label>
                        <input
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            placeholder="Nguyễn Văn A..."
                            className="mw-input"
                        />
                        {errors.customerName && (
                            <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-[#8c6a57] uppercase tracking-widest mb-1.5 block">
                            Số điện thoại
                        </label>
                        <input
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            placeholder="09xxxxxxxx..."
                            className="mw-input"
                        />
                        {errors.customerPhone && (
                            <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-[#8c6a57] uppercase tracking-widest mb-1.5 block">
                            Số người
                        </label>
                        <input
                            name="numberOfGuests"
                            type="number"
                            value={formData.numberOfGuests}
                            onChange={handleChange}
                            placeholder="2 người..."
                            className="mw-input"
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-[#8c6a57] uppercase tracking-widest mb-1.5 block">
                            Ngày đặt bàn
                        </label>
                        <input
                            name="bookingDate"
                            type="date"
                            value={formData.bookingDate}
                            onChange={handleChange}
                            className="mw-input"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-[#8c6a57] uppercase tracking-widest mb-1.5 block">
                            Giờ đặt bàn
                        </label>
                        <TimePicker
                            value={formData.bookingTime}
                            onSelect={handleTimeSelect}
                            error={errors.bookingTime}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`mw-btn-primary w-full mt-2 ${loading ? 'opacity-70 cursor-wait hover:translate-y-0' : ''}`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2 justify-center">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Đang xử lý...
                            </span>
                        ) : (
                            'Xác Nhận Đặt Bàn'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InfoCustomer;

