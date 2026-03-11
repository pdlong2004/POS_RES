import { TrendingUp, Calendar, BarChart3, Loader2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useState } from 'react';
import { useRevenueStats } from '@/hooks/useRevenueStats';

const chartConfig = {
    revenue: {
        label: 'Doanh thu',
        color: 'hsl(25, 95%, 53%)',
    },
};

const StatsChart = () => {
    const [filterType, setFilterType] = useState('month');
    const { chartData, loading, error } = useRevenueStats(filterType);

    const filterLabels = {
        month: 'Theo tháng',
        day: 'Theo ngày',
        hour: 'Theo giờ',
    };

    return (
        <Card className="border-0 shadow-lg bg-linear-to-br from-white to-slate-50">
            <CardHeader className="border-b border-slate-100 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-3 bg-linear-to-br from-orange-100 to-orange-50 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-slate-900">Doanh thu</CardTitle>
                            <CardDescription className="text-slate-600 mt-1">
                                Năm {new Date().getFullYear()} - Thống kê chi tiết
                            </CardDescription>
                        </div>
                    </div>

                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full sm:w-44 bg-white border-slate-200 focus:ring-orange-500">
                            <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="month">Theo tháng</SelectItem>
                            <SelectItem value="day">Theo ngày</SelectItem>
                            <SelectItem value="hour">Theo giờ</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                {loading && (
                    <div className="flex flex-col items-center justify-center h-96 gap-4">
                        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                        <p className="text-sm text-slate-600">Đang tải dữ liệu thống kê...</p>
                    </div>
                )}

                {!loading && !error && chartData && (
                    <div className="space-y-4">
                        <ChartContainer config={chartConfig} className="h-80 w-full">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="0" />
                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    fontSize={12}
                                    fill="#64748b"
                                />
                                <ChartTooltip
                                    cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
                                    content={<ChartTooltipContent />}
                                />
                                <Bar
                                    dataKey="revenue"
                                    fill={chartConfig.revenue.color}
                                    radius={[8, 8, 0, 0]}
                                    animationDuration={800}
                                >
                                    <LabelList
                                        position="top"
                                        formatter={(v) => `${(v / 1000000).toFixed(1)}M` || 'N/A'}
                                        fontSize={11}
                                        fill="#334155"
                                        fontWeight="600"
                                    />
                                </Bar>
                            </BarChart>
                        </ChartContainer>

                        <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                            <span className="font-medium text-slate-900">
                                Thống kê doanh thu {filterLabels[filterType].toLowerCase()}
                            </span>
                            <span className="text-slate-500 ml-auto">Cập nhật: Hôm nay</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center h-64 gap-3 bg-red-50 rounded-lg border border-red-200 p-6">
                        <div className="text-red-600 font-medium">Không thể tải dữ liệu</div>
                        <p className="text-sm text-red-500">Vui lòng thử lại sau</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default StatsChart;
