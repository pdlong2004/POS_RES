import React, { useState } from 'react';
import QRCodeModal from './QRCodeModal';
import { useTable } from '../../../hooks/useTable';

const statusColors = {
    empty: 'border-green-500 bg-green-50 text-green-700',
    occupied: 'border-red-500 bg-red-50 text-red-700',
    reserved: 'border-yellow-500 bg-yellow-50 text-yellow-700',
};

const TableMap = ({ onClose }) => {
    const { tables = [], loading } = useTable();
    const [selectedTable, setSelectedTable] = useState(null);

    if (loading) {
        return (
            <div className="w-screen top-4 h-screen fixed inset-0 flex items-center justify-center bg-black/50 z-40">
                <div className="bg-white p-6 rounded-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-9999 h-screen bg-black/50 backdrop-blur-sm flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="w-[85%] h-[85%] bg-white p-6 rounded-xl shadow-lg border border-gray-100 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Sơ đồ nhà hàng</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl cursor-pointer">
                        ✕
                    </button>
                </div>

                {tables.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">Chưa có bàn nào</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {tables.map((table) => {
                            const { name: statusName, code } = table.statusId || {};

                            return (
                                <div
                                    key={table._id}
                                    onClick={() => code !== 'occupied' && setSelectedTable(table)}
                                    className={`
                                        cursor-pointer rounded-xl border-2 p-5
                                        flex flex-col items-center justify-center
                                        transition-all duration-200
                                        hover:scale-[1.03]
                                        ${statusColors[code] || 'border-gray-300 bg-gray-50'}
                                        ${code === 'occupied' ? 'opacity-70 cursor-not-allowed' : ''}
                                    `}
                                >
                                    <img
                                        src="https://png.pngtree.com/png-vector/20220608/ourmid/pngtree-restaurant-table-chairs-icon-dining-png-image_4814616.png"
                                        alt="table"
                                        className="h-14 w-14 mb-2 object-contain"
                                    />

                                    <h3 className="font-bold text-lg">{table.name}</h3>

                                    <span className="text-xs font-medium px-3 py-1 mt-1 rounded-full bg-white/70">
                                        {statusName || 'Không xác định'}
                                    </span>

                                    {table.direction && (
                                        <span className="mt-1 text-xs text-gray-500">Vị trí: {table.direction}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {selectedTable && <QRCodeModal table={selectedTable} onClose={() => setSelectedTable(null)} />}
            </div>
        </div>
    );
};

export default TableMap;

