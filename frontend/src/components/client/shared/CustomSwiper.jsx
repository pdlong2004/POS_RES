import { useEffect, useState } from 'react';

const CustomSwiper = ({ items, renderSlide, autoPlay = true, delay = 4500 }) => {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const total = items.length;

    const next = () => {
        setDirection(1);
        setIndex((i) => (i + 1) % total);
    };

    const prev = () => {
        setDirection(-1);
        setIndex((i) => (i - 1 + total) % total);
    };

    useEffect(() => {
        if (!autoPlay) return;
        const timer = setInterval(next, delay);
        return () => clearInterval(timer);
    }, [index, autoPlay, delay]);

    return (
        <div className="relative overflow-hidden py-2">
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                    transform: `translateX(-${index * 100}%)`,
                }}
            >
                {items.map((item, i) => (
                    <div key={i} className="w-full shrink-0">
                        {renderSlide(item)}
                    </div>
                ))}
            </div>

            {/* NAV */}
            <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 hidden lg:flex text-5xl text-gray-300 font-light cursor-pointer hover:text-black"
            >
                ‹
            </button>

            <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex text-5xl text-gray-300 font-light cursor-pointer hover:text-black"
            >
                ›
            </button>
        </div>
    );
};

export default CustomSwiper;

