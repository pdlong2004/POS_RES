import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import AdminLoading from '@/components/admin/shared/AdminLoading';
import { getScheduleApi, checkInApi, checkOutApi } from '@/service/staff.service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
    Clock,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    XCircle,
    Timer,
    Fingerprint,
    CalendarDays,
    Zap,
    ShieldCheck,
    RefreshCw,
    Briefcase,
    MapPin,
    ArrowRight,
    Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const formatLocalYMD = (dateStringOrObj) => {
    if (!dateStringOrObj) return '';
    const d = new Date(dateStringOrObj);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const StaffSchedule = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    });

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        return d;
    });

    const fetchSchedule = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const filterObj = {
                start: formatLocalYMD(startDate),
                end: formatLocalYMD(weekDays[6]),
            };
            const res = await getScheduleApi(filterObj);

            const myShifts = (res.data?.data || []).filter((s) => {
                const sId = (s.accountId?._id || s.accountId || '').toString();
                const uId = (user.id || user._id || '').toString();
                return sId === uId;
            });
            setSchedule(myShifts);
        } catch (error) {
            console.error(error);
            toast.error('Không thể đồng bộ lịch công tác cá nhân');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, [startDate, user]);

    const handleCheckIn = async (assignmentId) => {
        try {
            await checkInApi(assignmentId);
            toast.success('Xác thực Check-in thành công!');
            fetchSchedule();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi xác thực Check-in');
        }
    };

    const handleCheckOut = async (assignmentId) => {
        try {
            await checkOutApi(assignmentId);
            toast.success('Xác thực Check-out thành công!');
            fetchSchedule();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi xác thực Check-out');
        }
    };

    const changeWeek = (direction) => {
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + direction * 7);
        setStartDate(newDate);
    };

    return (
        <AdminLayout className="space-y-12">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shadow-xl shadow-orange-50/50 transition-transform hover:rotate-6">
                        <Fingerprint size={40} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
                            Lịch trình công tác
                        </h1>
                        <p className="text-slate-500 mt-1 font-bold italic text-sm">
                            Quản lý thời gian biểu cá nhân và xác thực hiện diện qua hệ thống Check-in sinh
                            trắc học.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white border border-slate-100 rounded-[2rem] p-2 shadow-sm">
                    <button
                        onClick={() => changeWeek(-1)}
                        className="p-3 hover:bg-orange-50 text-slate-400 hover:text-orange-600 rounded-2xl transition-all active:scale-90"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="px-10 text-[11px] font-black text-slate-900 flex items-center gap-5 uppercase tracking-widest min-w-[320px] justify-center">
                        <CalendarDays size={18} className="text-orange-600" />
                        <span>
                            {startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                            <span className="mx-4 text-orange-200">/</span>
                            {weekDays[6].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                        </span>
                    </div>
                    <button
                        onClick={() => changeWeek(1)}
                        className="p-3 hover:bg-orange-50 text-slate-400 hover:text-orange-600 rounded-2xl transition-all active:scale-90"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                {loading ? (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center">
                        <RefreshCw size={48} className="text-orange-600 animate-spin mb-6" />
                        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">
                            Đang truy xuất ma trận lịch trình Manwah...
                        </p>
                    </div>
                ) : schedule.length === 0 ? (
                    <div className="col-span-full admin-card py-40 flex flex-col items-center justify-center bg-white/30 border-dashed border-2 border-slate-200 rounded-[3.5rem]">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100 shadow-inner opacity-40">
                            <Clock size={48} strokeWidth={1} className="text-slate-900" />
                        </div>
                        <p className="text-slate-900 font-black uppercase tracking-widest text-lg">
                            Không có dữ liệu phân ca
                        </p>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-3 italic text-center leading-relaxed">
                            Bạn không có lịch trình công tác nào được phân gán <br /> trong khoảng thời gian này.
                        </p>
                    </div>
                ) : (
                    schedule.map((assign) => {
                        const dateObj = new Date(assign.date);
                        const isToday = formatLocalYMD(new Date()) === formatLocalYMD(assign.date);
                        const hasCheckedIn = !!assign.checkIn;
                        const hasCheckedOut = !!assign.checkOut;

                        return (
                            <div
                                key={assign._id}
                                className={cn(
                                    'admin-card group transition-all duration-700 overflow-hidden relative bg-white/50 shadow-sm',
                                    isToday && 'ring-2 ring-orange-600/20 border-orange-600/20 shadow-xl shadow-orange-100/50',
                                )}
                            >
                                {isToday && (
                                    <div className="absolute top-0 right-0 p-5">
                                        <div className="flex items-center gap-2 bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full animate-pulse shadow-lg shadow-orange-200">
                                            <Zap size={10} fill="currentColor" /> Today Active
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 space-y-10">
                                    <div className="space-y-5">
                                        <div className="space-y-1">
                                            <p
                                                className={cn(
                                                    'text-[10px] font-black uppercase tracking-[0.2em]',
                                                    isToday ? 'text-orange-600' : 'text-slate-400',
                                                )}
                                            >
                                                {dateObj.toLocaleDateString('vi-VN', { weekday: 'long' })}
                                            </p>
                                            <p className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums uppercase">
                                                {dateObj.toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                })}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-5 p-5 bg-white border border-slate-50 rounded-2xl shadow-sm group-hover:border-orange-100 transition-colors">
                                            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 shrink-0">
                                                <Briefcase size={22} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">
                                                    {assign.shiftId?.name || 'Ca công tác'}
                                                </h3>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 tabular-nums italic">
                                                    {assign.shiftId?.startTime} <span className="text-orange-300 mx-1">→</span> {assign.shiftId?.endTime}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        {hasCheckedOut ? (
                                            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex flex-col items-center gap-3 text-emerald-600 animate-in zoom-in-95 duration-500 shadow-sm">
                                                <ShieldCheck size={32} />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                                    Hoàn tất lộ trình
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-4">
                                                <button
                                                    disabled={hasCheckedIn || !isToday}
                                                    onClick={() => handleCheckIn(assign._id)}
                                                    className={cn(
                                                        'w-full h-16 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50',
                                                        hasCheckedIn
                                                            ? 'bg-slate-50 text-slate-400 border border-slate-100'
                                                            : isToday
                                                              ? 'bg-orange-600 text-white shadow-xl shadow-orange-100 hover:bg-orange-700'
                                                              : 'bg-slate-50 text-slate-200 border border-slate-100 cursor-not-allowed',
                                                    )}
                                                >
                                                    {hasCheckedIn ? (
                                                        <CheckCircle2 size={18} />
                                                    ) : (
                                                        <Zap size={18} />
                                                    )}
                                                    {hasCheckedIn ? 'Đã Check-in' : 'Kích hoạt Check-in'}
                                                </button>

                                                <button
                                                    disabled={!hasCheckedIn || hasCheckedOut || !isToday}
                                                    onClick={() => handleCheckOut(assign._id)}
                                                    className={cn(
                                                        'w-full h-16 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border-2 active:scale-95 disabled:opacity-50',
                                                        hasCheckedIn && !hasCheckedOut && isToday
                                                            ? 'border-orange-600 text-orange-600 hover:bg-orange-50'
                                                            : 'border-slate-100 text-slate-200 cursor-not-allowed',
                                                    )}
                                                >
                                                    <Timer size={18} /> Kết thúc ca làm
                                                </button>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-4 bg-white border border-slate-50 rounded-2xl shadow-xs">
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">
                                                    Check-in
                                                </p>
                                                <p className="text-xs font-black text-slate-900 tabular-nums">
                                                    {hasCheckedIn
                                                        ? new Date(assign.checkIn).toLocaleTimeString(
                                                              'vi-VN',
                                                              { hour: '2-digit', minute: '2-digit' },
                                                          )
                                                        : '--:--'}
                                                </p>
                                            </div>
                                            <div className="text-center p-4 bg-white border border-slate-50 rounded-2xl shadow-xs">
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">
                                                    Check-out
                                                </p>
                                                <p className="text-xs font-black text-slate-900 tabular-nums">
                                                    {hasCheckedOut
                                                        ? new Date(assign.checkOut).toLocaleTimeString(
                                                              'vi-VN',
                                                              { hour: '2-digit', minute: '2-digit' },
                                                          )
                                                        : '--:--'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest pt-5 border-t border-slate-50">
                                        <span className="flex items-center gap-2 group-hover:text-orange-400 transition-colors">
                                            <MapPin size={12} /> Zone A-01
                                        </span>
                                        <span>Verified Manwah</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* SYSTEM ADVISORY */}
            <div className="p-10 bg-orange-600 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-10 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 shadow-2xl shadow-orange-100">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-[80px]" />
                <div className="w-20 h-20 rounded-[2.5rem] bg-white/20 backdrop-blur-xl flex items-center justify-center text-white shrink-0 shadow-2xl border border-white/30">
                    <ShieldCheck size={40} />
                </div>
                <div className="space-y-3 text-center md:text-left relative z-10 flex-1">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                        Giao thức bảo mật & Chấm công Manwah
                    </h3>
                    <p className="text-sm text-orange-100 leading-relaxed font-bold italic opacity-90">
                        Vui lòng thực hiện Check-in / Check-out trong phạm vi mạng nội bộ (WLAN) của nhà
                        hàng để đảm bảo tính xác thực. Mọi dữ liệu sai lệch sẽ được chuyển tiếp đến bộ phận
                        nhân sự để thẩm định định danh sinh trắc học.
                    </p>
                </div>
                <button
                    onClick={fetchSchedule}
                    className="h-16 px-10 bg-white text-orange-600 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-2xl transition-all active:scale-95 hover:bg-slate-50"
                >
                    <RefreshCw size={20} /> Đồng bộ hệ thống
                </button>
            </div>
        </AdminLayout>
    );
};

export default StaffSchedule;


