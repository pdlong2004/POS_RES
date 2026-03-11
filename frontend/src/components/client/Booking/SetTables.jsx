import React from 'react';
import { suggestTableData } from '../Booking/data/SuggestTable';
import { VscChevronRight } from 'react-icons/vsc';

const SetTables = () => {
    return (
        <div className="font-sans">
            <h3 className="font-serif text-3xl font-bold mb-7.75">Set Table</h3>
            <p className="text-gray-500 mb-5">
                Quý khách vui lòng đặt bàn trước để có trải nghiệm thưởng thức ẩm thực tốt nhất tại .
            </p>
            <p className="mb-5 font-bold">Gợi ý đặt bàn:</p>
            <ul className="">
                {suggestTableData.map((item) => (
                    <div key={item.id} className="flex items-center border-b-2 border-gray-200 text-gray-600">
                        <VscChevronRight />
                        <li className="py-2 pl-6.5" key={item.id}>
                            {item.suggest}
                        </li>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default SetTables;
