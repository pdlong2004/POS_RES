import React from 'react';
import { suggestTableData } from '../Booking/data/SuggestTable';
import { VscChevronRight } from 'react-icons/vsc';

const SetTables = () => {
    return (
        <div className="bg-white rounded-3xl border border-[#f5e8d8] shadow-md overflow-hidden">
            {/* Card header */}
            <div className="bg-[#1a0c08] px-6 py-5 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">Bước 1</p>
                <h3 className="text-xl font-bold mw-subheading">Gợi Ý Đặt Bàn</h3>
            </div>

            <div className="p-6">
                <p className="text-[#8c6a57] text-sm leading-relaxed mb-5">
                    Quý khách vui lòng đặt bàn trước để có trải nghiệm thưởng thức ẩm thực tốt nhất tại Manwah.
                    Chúng tôi sẽ chuẩn bị chỗ ngồi và hỗ trợ bạn ngay khi đến.
                </p>

                <div className="mb-5">
                    <p className="text-xs font-bold text-[#8c6a57] uppercase tracking-widest mb-3">
                        Lưu ý khi đặt bàn
                    </p>
                    <ul className="space-y-1">
                        {suggestTableData.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-start gap-2 py-2.5 border-b border-[#f5e8d8] last:border-0"
                            >
                                <VscChevronRight className="text-[#C8392B] shrink-0 mt-0.5" />
                                <li className="text-sm text-[#5a3e30] leading-relaxed list-none">
                                    {item.suggest}
                                </li>
                            </div>
                        ))}
                    </ul>
                </div>

                {/* Opening hours info */}
                <div className="p-4 bg-[#fdf5ec] border border-[#f5e8d8] rounded-2xl">
                    <p className="text-xs font-bold text-[#C8392B] uppercase tracking-widest mb-2">
                        Giờ mở cửa
                    </p>
                    <div className="flex justify-between text-sm">
                        <span className="text-[#8c6a57]">Thứ 2 – Thứ 6</span>
                        <span className="font-bold text-[#3d2314]">10:00 – 22:00</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                        <span className="text-[#8c6a57]">Thứ 7 – Chủ nhật</span>
                        <span className="font-bold text-[#3d2314]">09:00 – 22:30</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetTables;

