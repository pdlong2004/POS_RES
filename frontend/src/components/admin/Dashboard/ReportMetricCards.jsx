import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color }) => {
    const colorStyles = {
        orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30 shadow-orange-100/50 dark:shadow-none',
        emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 shadow-emerald-100/50 dark:shadow-none',
        rose: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30 shadow-rose-100/50 dark:shadow-none',
    };

    return (
        <div className="admin-card p-8 group transition-all duration-500 relative overflow-hidden bg-white/50 dark:bg-zinc-900/50 border-white/40 dark:border-zinc-800/50 shadow-sm rounded-[2.5rem]">
            {/* Ambient Background Glow */}
            <div
                className={cn(
                    'absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000',
                    color === 'orange' ? 'bg-orange-400' : color === 'rose' ? 'bg-rose-400' : 'bg-emerald-400',
                )}
            />

            <div className="flex items-start justify-between relative z-10">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{title}</p>
                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
                    </div>
                </div>
                <div
                    className={cn(
                        'w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-500 shadow-lg group-hover:rotate-6 group-hover:scale-110',
                        colorStyles[color],
                    )}
                >
                    <Icon className="h-6 w-6" strokeWidth={2.5} />
                </div>
            </div>

            <div className="mt-6 flex items-center gap-4 relative z-10">
                {trend && (
                    <div
                        className={cn(
                            'flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black border-2',
                            trend > 0
                                ? 'text-emerald-600 dark:text-emerald-400 bg-white dark:bg-zinc-900 border-emerald-50 dark:border-emerald-900/30'
                                : 'text-rose-600 dark:text-rose-400 bg-white dark:bg-zinc-900 border-rose-50 dark:border-rose-900/30',
                        )}
                    >
                        {trend > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        {Math.abs(trend)}%
                    </div>
                )}
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest italic opacity-80">{subtitle}</p>
            </div>
        </div>
    );
};

const ReportMetricCards = ({ summary }) => {
    if (!summary) return null;

    const formatPrice = (p) => `${Number(p).toLocaleString('vi-VN')}₫`;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MetricCard
                title="Tổng doanh thu"
                value={formatPrice(summary.totalRevenue)}
                subtitle="Tính từ khi bắt đầu"
                icon={Target}
                color="orange"
                trend={12.5}
            />
            <MetricCard
                title="Tổng đơn hàng"
                value={summary.totalOrders}
                subtitle="Đã thanh toán thành công"
                icon={Zap}
                color="rose"
                trend={8.2}
            />
            <MetricCard
                title="Giá trị TB (AOV)"
                value={formatPrice(summary.aov)}
                subtitle="Trung bình mỗi hóa đơn"
                icon={Activity}
                color="emerald"
                trend={5.4}
            />
        </div>
    );
};

export default ReportMetricCards;

