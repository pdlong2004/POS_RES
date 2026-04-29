import { TrendingUp, Calendar, BarChart3, Loader2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useRevenueStats } from '@/hooks/useRevenueStats';
import { useTheme } from '@/context/ThemeContext';

const chartConfig = {
    revenue: {
        label: 'Doanh thu',
        color: '#f97316',
    },
};

const StatsChart = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [filterType, setFilterType] = useState('month');
    const { chartData, loading, error } = useRevenueStats(filterType);

    const filterLabels = {
        month: 'Theo tháng',
        day: 'Theo ngày',
        hour: 'Theo giờ',
    };

    return (
        <div className="admin-card overflow-hidden bg-white/50 dark:bg-zinc-900/50 border-white/40 dark:border-zinc-800/50">
            <div className="px-8 py-6 border-b border-white/20 dark:border-zinc-800/50 bg-white/10 dark:bg-zinc-800/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-600 rounded-2xl shadow-lg shadow-orange-100 dark:shadow-none">
                        <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Thống kê doanh thu</h3>
                        <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mt-0.5">
                            Data trends over the last 30 days
                        </p>
                    </div>
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-48 bg-white/50 dark:bg-zinc-900/50 border-white dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-orange-500/30 rounded-xl font-bold text-xs h-10">
                        <Calendar className="h-4 w-4 mr-2 text-orange-600" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-white dark:border-zinc-800 text-slate-900 dark:text-white rounded-2xl shadow-2xl">
                        <SelectItem value="month" className="focus:bg-orange-50 dark:focus:bg-orange-950/20 focus:text-orange-600 font-bold text-xs rounded-lg">
                            Theo tháng
                        </SelectItem>
                        <SelectItem value="day" className="focus:bg-orange-50 dark:focus:bg-orange-950/20 focus:text-orange-600 font-bold text-xs rounded-lg">
                            Theo ngày
                        </SelectItem>
                        <SelectItem value="hour" className="focus:bg-orange-50 dark:focus:bg-orange-950/20 focus:text-orange-600 font-bold text-xs rounded-lg">
                            Theo giờ
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="p-8">
                {loading && (
                    <div className="flex flex-col items-center justify-center h-[350px] gap-4">
                        <Loader2 className="h-8 w-8 text-orange-600 animate-spin" />
                        <p className="text-sm font-bold text-slate-400">Đang tải dữ liệu...</p>
                    </div>
                )}

                {!loading && !error && chartData && (
                    <div className="space-y-6">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#fb923c" stopOpacity={0.6} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} stroke={isDark ? "#27272a" : "#f1f5f9"} strokeDasharray="4 4" />
                                    <XAxis
                                        dataKey="label"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={12}
                                        fontSize={10}
                                        stroke={isDark ? "#71717a" : "#94a3b8"}
                                        fontWeight="700"
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(99, 102, 241, 0.05)', radius: 12 }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-white dark:border-zinc-800 p-4 rounded-2xl shadow-2xl">
                                                        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                                                            {payload[0].payload.label}
                                                        </p>
                                                        <p className="text-slate-900 dark:text-white font-black text-lg">
                                                            {Number(payload[0].value).toLocaleString('vi-VN')}đ
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar
                                        dataKey="revenue"
                                        fill="url(#barGradient)"
                                        radius={[12, 12, 12, 12]}
                                        animationDuration={1500}
                                        barSize={filterType === 'hour' ? 12 : 40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center h-[350px] gap-4 bg-red-50/50 dark:bg-red-950/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-8">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                            <TrendingUp size={24} className="rotate-180" />
                        </div>
                        <div className="text-center">
                            <h4 className="text-slate-900 dark:text-white font-bold mb-1">Không thể tải dữ liệu</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Vui lòng kiểm tra kết nối mạng và thử lại sau</p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-white border border-slate-200 text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all"
                        >
                            Thử lại ngay
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsChart;

