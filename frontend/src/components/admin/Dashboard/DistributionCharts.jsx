import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

const COLORS = [
    '#f97316', // Orange
    '#3b82f6', // Blue
    '#10b981', // Green
    '#8b5cf6', // Purple
    '#f59e0b', // Yellow
    '#ef4444', // Red
];

const DistributionCharts = ({ categoryStats, paymentStats }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Distribution */}
            <div className="admin-card overflow-hidden h-[450px] flex flex-col bg-white/50 dark:bg-zinc-900/50 border-white/40 dark:border-zinc-800/50 rounded-[2.5rem]">
                <div className="px-6 py-5 border-b border-slate-50 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight uppercase">Cơ cấu doanh thu</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest">
                        Phân bổ theo danh mục
                    </p>
                </div>
                <div className="flex-1 p-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryStats}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={8}
                                dataKey="value"
                                nameKey="name"
                                stroke="none"
                            >
                                {categoryStats?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-white dark:border-zinc-800 p-4 rounded-2xl shadow-2xl">
                                                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
                                                    {payload[0].name}
                                                </p>
                                                <p className="text-slate-900 dark:text-white font-black text-base">
                                                    {Number(payload[0].value).toLocaleString('vi-VN')}đ
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                formatter={(value) => (
                                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest ml-1">{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Payment Method Distribution */}
            <div className="admin-card overflow-hidden h-[450px] flex flex-col bg-white/50 dark:bg-zinc-900/50 border-white/40 dark:border-zinc-800/50 rounded-[2.5rem]">
                <div className="px-6 py-5 border-b border-slate-50 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight uppercase">Phương thức thanh toán</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest">Tỷ lệ sử dụng</p>
                </div>
                <div className="flex-1 p-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={paymentStats}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={8}
                                dataKey="value"
                                nameKey="_id"
                                stroke="none"
                            >
                                {paymentStats?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-white dark:border-zinc-800 p-4 rounded-2xl shadow-2xl">
                                                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
                                                    {payload[0].name}
                                                </p>
                                                <p className="text-slate-900 dark:text-white font-black text-base">
                                                    {Number(payload[0].value).toLocaleString('vi-VN')}đ
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                formatter={(value) => (
                                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest ml-1">{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DistributionCharts;

