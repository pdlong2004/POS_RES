import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
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
            <AdminLayout className="flex flex-col items-center justify-center py-40">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-orange-500/10 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs mt-8 animate-pulse">
                    Đang ánh xạ thực thể kinh doanh...
                </p>
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
                            Báo cáo Intelligence
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm italic">
                            Trích xuất tri thức từ dữ liệu vận hành thực tế của doanh nghiệp.
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
                                        Phân tích dòng tiền doanh thu
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Xu hướng 30
                                    ngày qua
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
                                    Phân bổ danh mục & Hình thức thanh toán
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
                                    Thực đơn thịnh hành
                                </span>
                            </div>
                            <div className="p-8">
                                <TopSellers products={data?.topSellers} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ADVISORY BANNER */}
                <div className="p-10 bg-orange-600 rounded-[3rem] border border-orange-400 flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden shadow-2xl shadow-orange-200">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400/20 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />

                    <div className="flex items-center gap-8 relative z-10">
                        <div className="w-20 h-20 rounded-[2rem] bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500 shadow-xl">
                            <Sparkles size={32} />
                        </div>
                        <div className="max-w-2xl">
                            <h4 className="text-2xl font-black text-white tracking-tight uppercase">
                                Tự động hóa báo cáo định kỳ?
                            </h4>
                            <p className="text-orange-100 font-bold text-sm mt-1">
                                Hệ thống sẽ tự động tổng hợp và gửi báo cáo phân tích PDF qua email quản trị vào lúc
                                23:59 mỗi ngày.
                            </p>
                        </div>
                    </div>
                    <button className="h-16 px-12 bg-white text-orange-600 hover:bg-slate-50 transition-all uppercase font-black text-xs tracking-widest rounded-2xl shadow-xl shadow-orange-900/20 active:scale-95 relative z-10">
                        Kích hoạt ngay
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminReports;
