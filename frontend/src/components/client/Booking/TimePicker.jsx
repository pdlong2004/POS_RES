const TIMES = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30',
];

const TimePicker = ({ value, onSelect, error }) => {
    return (
        <div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-1 scrollbar-hide">
                {TIMES.map((time) => (
                    <button
                        type="button"
                        key={time}
                        onClick={() => onSelect(time)}
                        className={`py-2 px-3 rounded-xl text-sm font-semibold border transition-all duration-200 text-center ${
                            value === time
                                ? 'bg-[#C8392B] text-white border-[#C8392B] shadow-md shadow-[#C8392B]/30'
                                : 'bg-[#fffaf6] border-[#e8d5c4] text-[#5a3e30] hover:border-[#C8392B] hover:text-[#C8392B]'
                        }`}
                    >
                        {time}
                    </button>
                ))}
            </div>

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
    );
};

export default TimePicker;

