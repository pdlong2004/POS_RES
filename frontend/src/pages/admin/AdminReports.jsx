import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import AdminLoading from '@/components/admin/shared/AdminLoading';
import StatsChart from '@/components/admin/Dashboard/StatsChart';
import ReportMetricCards from '@/components/admin/Dashboard/ReportMetricCards';
import DistributionCharts from '@/components/admin/Dashboard/DistributionCharts';
import TopSellers from '@/components/admin/Dashboard/TopSellers';
import api from '@/lib/axois';
import {
    Loader2,
    RefreshCw,
    FileText,
    Calendar,
    TrendingUp,
    Download,
    Share2,
    Zap,
    BarChart3,
    PieChart,
    Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

const AdminReports = () => {
    const { toast } = useToast();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAdvancedStats = async () => {
        setIsRefreshing(true);
        try {
            const res = await api.get('/stats/advanced');
            setData(res.data);
        } catch (err) {
            console.error('Failed to fetch stats', err);
            toast.error('Không thể đồng bộ dữ liệu báo cáo');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAdvancedStats();
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <AdminLoading message="Đang tải báo cáo..." />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout className="space-y-12">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-100">
                        <BarChart3 size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                            Báo cáo
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm italic">
                            Theo dõi doanh thu, sản phẩm bán chạy và hình thức thanh toán.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-900/50 px-6 py-3 rounded-2xl border border-slate-100 dark:border-zinc-800 text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest shadow-sm">
                        <Calendar size={14} className="text-orange-600 dark:text-orange-500" />
                        Chu kỳ: {new Date().toLocaleDateString('vi-VN')}
                    </div>
                    <button
                        onClick={fetchAdvancedStats}
                        disabled={isRefreshing}
                        className="admin-btn-secondary w-12 h-12 flex items-center justify-center p-0 rounded-2xl dark:bg-zinc-900/50 dark:border-zinc-800"
                    >
                        <RefreshCw className={cn('w-5 h-5', isRefreshing && 'animate-spin')} />
                    </button>
                    <button className="h-12 px-8 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 transition-all flex items-center gap-3">
                        <Download size={18} /> <span className="hidden sm:inline">Xuất báo cáo</span>
                    </button>
                </div>
            </div>

            {/* ANALYTICS DASHBOARD LAYOUT */}
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                {/* TOP LEVEL METRICS */}
                <div className="relative">
                    <ReportMetricCards summary={data?.summary} />
                </div>

                {/* MAIN ANALYTICS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* PRIMARY CHARTS */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="admin-card p-0 border-white/40 dark:border-zinc-800/50 overflow-hidden rounded-[2.5rem] bg-white/50 dark:bg-zinc-900/50">
                            <div className="p-8 border-b border-slate-50 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-800/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <TrendingUp size={18} />
                                    </div>
                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                        Doanh thu
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" /> 30 ngày qua
                                </div>
                            </div>
                            <div className="p-8">
                                <StatsChart />
                            </div>
                        </div>

                        {/* DETAILED DISTRIBUTION */}
                        <div className="admin-card p-0 border-white/40 dark:border-zinc-800/50 overflow-hidden rounded-[2.5rem] bg-white/50 dark:bg-zinc-900/50">
                            <div className="p-8 border-b border-slate-50 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-800/30 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                                    <PieChart size={18} />
                                </div>
                                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                    Danh mục & thanh toán
                                </span>
                            </div>
                            <div className="p-8">
                                <DistributionCharts
                                    categoryStats={data?.categoryStats}
                                    paymentStats={data?.paymentStats}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECONDARY INSIGHTS */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="admin-card p-0 border-white/40 dark:border-zinc-800/50 overflow-hidden h-full rounded-[2.5rem] bg-white/50 dark:bg-zinc-900/50">
                            <div className="p-8 border-b border-slate-50 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-800/30 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                    <Zap size={18} />
                                </div>
                                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                    Sản phẩm bán chạy
                                </span>
                            </div>
                            <div className="p-8">
                                <TopSellers products={data?.topSellers} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6 dark:border-orange-900/30 dark:bg-orange-950/20">
                    <h4 className="text-sm font-black uppercase tracking-widest text-orange-700 dark:text-orange-300">
                        Gợi ý vận hành
                    </h4>
                    <p className="mt-2 text-sm font-bold text-orange-800 dark:text-orange-300">
                        Có thể xuất báo cáo để lưu hoặc gửi cho quản lý ca cuối ngày.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminReports;
