import React from 'react';

const Loading = ({ size = 40 }) => {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div
                className="animate-spin rounded-full
                border-4 border-gray-300 border-t-orange-500"
                style={{ width: size, height: size }}
            />
        </div>
    );
};

export default Loading;
