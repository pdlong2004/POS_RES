import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Users, Package, DollarSign, Loader2, Sparkles } from 'lucide-react';
import api from '@/lib/axois';

const chartConfig = {
    actual: {
        label: 'Thực tế',
        color: 'hsl(142, 71%, 45%)', // Emerald for actual
    },
    predicted: {
        label: 'Dự đoán (AI)',
        color: 'hsl(25, 95%, 53%)', // Orange for AI
    },
};

const AIPredictions = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const res = await api.get('/stats/predictions');
                setData(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Không thể tải dữ liệu AI Dự đoán');
                setLoading(false);
            }
        };

        fetchPredictions();
    }, []);

    const formatPrice = (p) => `${Number(p).toLocaleString('vi-VN')}đ`;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-slate-200 shadow-sm mt-8">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
                <p className="text-slate-600">AI đang xử lý dữ liệu...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-8 bg-red-50 text-red-600 rounded-lg border border-red-200 mt-8 text-center">
                <p>{error || 'Lỗi không xác định'}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">AI Dashboard</h2>
                    <p className="text-slate-600 text-sm">Chỉ số tức thời & Phân tích dự báo thông minh</p>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-slate-500 flex items-center font-medium">
                            <Users className="w-4 h-4 mr-2" />
                            Khách hôm nay
                        </CardDescription>
                        <CardTitle className="text-3xl font-bold text-slate-900">{data.customersToday}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-emerald-600 flex items-center mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Cập nhật tức thời
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-slate-500 flex items-center font-medium">
                            <Package className="w-4 h-4 mr-2" />
                            Tổng tồn kho
                        </CardDescription>
                        <CardTitle className="text-3xl font-bold text-slate-900">{data.inventoryCount}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-orange-600 flex items-center mt-1">
                            Lượng hàng đang có
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-slate-500 flex items-center font-medium">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Doanh thu HN
                        </CardDescription>
                        <CardTitle className="text-2xl font-bold text-slate-900">{formatPrice(data.revenueToday)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-emerald-600 flex items-center mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Real-time Revenue
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-slate-500 flex items-center font-medium">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Doanh thu Tháng
                        </CardDescription>
                        <CardTitle className="text-2xl font-bold text-indigo-600">{formatPrice(data.revenueMonth)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-indigo-500 flex items-center mt-1">
                            Cộng dồn từ đầu tháng
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* AI Revenue Prediction Chart */}
            <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                        AI Dự đoán Doanh thu (7 ngày tới)
                    </CardTitle>
                    <CardDescription>
                        Phân tích dựa trên thuật toán Linear Regression & Simple Moving Average từ 7 ngày trước.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-96 w-full mt-4">
                        <LineChart data={data.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                fontSize={12}
                                fill="#64748b"
                            />
                            <YAxis 
                                hide={false} 
                                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} 
                                width={50} 
                                axisLine={false}
                                tickLine={false}
                                fontSize={11}
                                stroke="#94a3b8"
                            />
                            <ChartTooltip
                                cursor={{ stroke: 'rgba(249, 115, 22, 0.2)', strokeWidth: 2 }}
                                content={<ChartTooltipContent />}
                            />
                            
                            <ReferenceLine x="Hôm nay" stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'Hiện tại', fill: '#64748b', fontSize: 12 }} />

                            <Line
                                type="monotone"
                                dataKey="actualRevenue"
                                stroke={chartConfig.actual.color}
                                strokeWidth={3}
                                dot={{ fill: chartConfig.actual.color, r: 4 }}
                                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                                name="Doanh thu thực tế"
                            />
                            
                            <Line
                                type="monotone"
                                dataKey="predictedRevenue"
                                stroke={chartConfig.predicted.color}
                                strokeWidth={3}
                                strokeDasharray="5 5"
                                dot={{ fill: '#fff', stroke: chartConfig.predicted.color, r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                                name="AI Dự đoán"
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default AIPredictions;
