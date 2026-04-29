import React, { useEffect, useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import AdminLoading from '@/components/admin/shared/AdminLoading';
import { getScheduleApi } from '@/service/staff.service';
import {
    CheckCircle2,
    Clock,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    RefreshCw,
    User,
    Timer,
    Fingerprint,
    ShieldCheck,
    ArrowRight,
    Search,
    Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import Pagination from '@/components/admin/shared/Pagination';

const formatLocalYMD = (dateStringOrObj) => {
    if (!dateStringOrObj) return '';
    const d = new Date(dateStringOrObj);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const AttendanceManagement = () => {
    const { toast } = useToast();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentDate, setCurrentDate] = useState(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const dateStr = formatLocalYMD(currentDate);
            const res = await getScheduleApi({ start: dateStr, end: dateStr });
            setSchedule(res.data.data);
        } catch (error) {
            console.error(error);
            toast.error('Không thể đồng bộ dữ liệu chấm công');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [currentDate]);

    const changeDate = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + direction);
        setCurrentDate(newDate);
    };

    const setToday = () => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        setCurrentDate(d);
    };

    const isToday = formatLocalYMD(currentDate) === formatLocalYMD(new Date());

    const filteredSchedule = useMemo(() => {
        return (schedule || []).filter(s => 
            s.accountId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.shiftId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [schedule, searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredSchedule.length / itemsPerPage);
    const paginatedSchedule = useMemo(() => {
        return filteredSchedule.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredSchedule, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, currentDate]);

    return (
        <AdminLayout className="space-y-12">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Nhật ký chấm công</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm italic">
                        Giám sát thực tế thời gian hiện diện và tuân thủ kỷ luật lao động Manwah.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    {!isToday && (
                        <button
                            onClick={setToday}
                            className="h-14 px-8 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all active:scale-95"
                        >
                            Quay về hôm nay
                        </button>
                    )}

                    <div className="flex items-center bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[1.5rem] p-1.5 shadow-sm">
                        <button
                            onClick={() => changeDate(-1)}
                            className="p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400 hover:text-orange-600 rounded-xl transition-all active:scale-90"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="px-8 text-[11px] font-black text-slate-900 dark:text-white flex items-center gap-4 uppercase tracking-widest min-w-[320px] justify-center">
                            <CalendarDays size={18} className="text-orange-600 dark:text-orange-500" />
                            <span>
                                {currentDate.toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                        <button
                            onClick={() => changeDate(1)}
                            className="p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400 hover:text-orange-600 rounded-xl transition-all active:scale-90"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <button
                        onClick={fetchAttendance}
                        className="admin-btn-secondary w-14 h-14 flex items-center justify-center p-0 rounded-2xl dark:bg-zinc-900/50 dark:border-zinc-800"
                        title="Tải lại dữ liệu"
                    >
                        <RefreshCw size={20} className={cn(loading && 'animate-spin')} />
                    </button>
                </div>
            </div>

            {/* ANALYTICS SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                {[
                    { label: 'Tổng nhân sự', value: schedule.length, icon: User, color: 'text-orange-600', bg: 'bg-orange-50' },
                    {
                        label: 'Đang hiện diện',
                        value: schedule.filter((s) => s.checkIn && !s.checkOut).length,
                        icon: Timer,
                        color: 'text-sky-600',
                        bg: 'bg-sky-50'
                    },
                    {
                        label: 'Đã hoàn thành',
                        value: schedule.filter((s) => s.checkOut).length,
                        icon: CheckCircle2,
                        color: 'text-emerald-600',
                        bg: 'bg-emerald-50'
                    },
                    {
                        label: 'Chưa Check-in',
                        value: schedule.filter((s) => !s.checkIn).length,
                        icon: AlertCircle,
                        color: 'text-rose-600',
                        bg: 'bg-rose-50'
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="admin-card p-8 group hover:border-orange-100 dark:hover:border-orange-900 transition-all shadow-sm bg-white dark:bg-zinc-900 border-white/20 dark:border-zinc-800/50"
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    {stat.label}
                                </p>
                                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                                    {stat.value}
                                </p>
                            </div>
                            <div
                                className={cn(
                                    'w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm',
                                    stat.bg,
                                    stat.color,
                                    'dark:bg-opacity-20'
                                )}
                            >
                                <stat.icon size={32} />
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                            Live Update <div className="w-1.5 h-1.5 rounded-full bg-orange-400 dark:bg-orange-600 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>

            {/* DATA TABLE & FILTER */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="flex items-center gap-6">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-zinc-700 group-focus-within:text-orange-600 dark:group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm nhân sự hoặc ca làm việc..."
                            className="admin-input h-16 pl-16 font-black uppercase tracking-tight text-slate-900 dark:text-white bg-white/50 dark:bg-zinc-900 border-white dark:border-zinc-800"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="h-16 px-8 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-400 dark:text-slate-500 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-sm hover:text-orange-600 hover:border-orange-100 transition-all">
                        <Filter size={18} /> Lọc kết quả
                    </button>
                </div>

                <div className="admin-card p-0 border-white/40 dark:border-zinc-800/50 overflow-hidden rounded-[2.5rem] shadow-sm bg-white/30 dark:bg-zinc-900/30">
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-zinc-800/50 backdrop-blur-xl border-b border-slate-100 dark:border-zinc-800">
                                    <th className="px-8 py-8 min-w-[320px]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-orange-600 dark:bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-100 dark:shadow-none">
                                                <User size={18} />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Hồ sơ nhân sự</span>
                                        </div>
                                    </th>
                                    <th className="px-8 py-8 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Ca định danh</th>
                                    <th className="px-8 py-8 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Khung giờ chuẩn</th>
                                    <th className="px-8 py-8 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Check-in</th>
                                    <th className="px-8 py-8 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Check-out</th>
                                    <th className="px-8 py-8 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest text-right">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-40 text-center">
                                            <div className="flex flex-col items-center gap-5">
                                                <RefreshCw size={40} className="text-orange-600 dark:text-orange-500 animate-spin" />
                                                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                                    Đang ánh xạ dữ liệu chấm công...
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredSchedule.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-40 text-center">
                                            <div className="flex flex-col items-center gap-8 opacity-40">
                                                <div className="w-24 h-24 bg-slate-50 dark:bg-zinc-800 rounded-[2.5rem] flex items-center justify-center border border-slate-100 dark:border-zinc-700 shadow-inner">
                                                    <AlertCircle size={48} className="text-slate-300 dark:text-zinc-600" />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-slate-900 dark:text-white text-base font-black uppercase tracking-widest">
                                                        Không có dữ liệu công tác
                                                    </p>
                                                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest italic leading-relaxed">
                                                        Không tìm thấy ca làm việc được phân gán cho ngày này <br /> hoặc khớp với từ khóa tìm kiếm.
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedSchedule.map((assign) => {
                                        const staff = assign.accountId;
                                        const shift = assign.shiftId;
                                        const hasCheckedIn = !!assign.checkIn;
                                        const hasCheckedOut = !!assign.checkOut;

                                        return (
                                            <tr key={assign._id} className="group transition-all hover:bg-slate-50/50 dark:hover:bg-zinc-800/50">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 flex items-center justify-center font-black text-sm text-orange-600 dark:text-orange-400 uppercase shadow-sm group-hover:scale-110 transition-all duration-500 overflow-hidden">
                                                            {staff?.image ? (
                                                                <img src={staff.image} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                staff?.name?.charAt(0) || <Fingerprint size={20} />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors truncate text-lg tracking-tight uppercase">
                                                                {staff?.name || 'Vô danh'}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1 truncate italic">
                                                                {staff?.employeeInfo?.position || 'Worker'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="px-4 py-1.5 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30 font-black uppercase tracking-widest text-[10px] rounded-lg shadow-sm">
                                                        {shift?.name || 'CA_MAC_DINH'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4 font-black text-slate-400 dark:text-slate-500 text-xs tabular-nums tracking-widest">
                                                        {shift?.startTime} 
                                                        <ArrowRight size={14} className="text-orange-600 dark:text-orange-500" /> 
                                                        {shift?.endTime}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {hasCheckedIn ? (
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200 dark:shadow-none animate-pulse" />
                                                            <span className="font-black text-slate-900 dark:text-white tabular-nums text-sm">
                                                                {new Date(assign.checkIn).toLocaleTimeString(
                                                                    'vi-VN',
                                                                    { hour: '2-digit', minute: '2-digit' },
                                                                )}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-200 dark:text-zinc-800 font-black tracking-widest tabular-nums text-sm">
                                                            --:--
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6">
                                                    {hasCheckedOut ? (
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-lg shadow-sky-200 dark:shadow-none" />
                                                            <span className="font-black text-slate-900 dark:text-white tabular-nums text-sm">
                                                                {new Date(assign.checkOut).toLocaleTimeString(
                                                                    'vi-VN',
                                                                    { hour: '2-digit', minute: '2-digit' },
                                                                )}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-200 dark:text-zinc-800 font-black tracking-widest tabular-nums text-sm">
                                                            --:--
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    {hasCheckedOut ? (
                                                        <span className="inline-flex items-center px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                            <ShieldCheck size={14} className="mr-2" /> Hoàn tất ca
                                                        </span>
                                                    ) : hasCheckedIn ? (
                                                        <span className="inline-flex items-center px-4 py-2 bg-orange-600 dark:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg dark:shadow-none shadow-orange-100">
                                                            <Timer size={14} className="mr-2" /> Đang vận hành
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-4 py-2 bg-slate-50 dark:bg-zinc-800/50 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                                            <AlertCircle size={14} className="mr-2" /> Chưa hiện diện
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredSchedule.length}
                        itemsPerPage={itemsPerPage}
                        className="bg-white/30 dark:bg-zinc-900/30"
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default AttendanceManagement;
