const TIMES = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
];

const TimePicker = ({ value, onSelect, error }) => {
    return (
        <div>
            <p className="font-medium mb-2">Chọn giờ</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {TIMES.map((time) => (
                    <label
                        key={time}
                        className={`flex items-center gap-2 border rounded-md px-2 py-1 cursor-pointer
              ${value === time ? 'bg-orange-100 border-orange-500' : 'hover:bg-orange-50'}`}
                    >
                        <input type="radio" checked={value === time} onChange={() => onSelect(time)} />
                        <span>{time}</span>
                    </label>
                ))}
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default TimePicker;
