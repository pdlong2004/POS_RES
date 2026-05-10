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
    Timer,
    CalendarDays,
    RefreshCw,
    Briefcase,
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
        <AdminLayout className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                        Lịch làm việc
                    </h1>
                    <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                        Xem ca được phân và chấm công trong tuần.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 dark:border-zinc-800 dark:bg-zinc-900">
                    <button
                        onClick={() => changeWeek(-1)}
                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-orange-600 dark:text-slate-400 dark:hover:bg-zinc-800"
                        aria-label="Tuần trước"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex min-w-[220px] items-center justify-center gap-2 px-3 text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                        <CalendarDays size={16} className="text-orange-600" />
                        <span>
                            {startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                            <span className="mx-2 text-slate-300">-</span>
                            {weekDays[6].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                        </span>
                    </div>
                    <button
                        onClick={() => changeWeek(1)}
                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-orange-600 dark:text-slate-400 dark:hover:bg-zinc-800"
                        aria-label="Tuần sau"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {loading ? (
                    <div className="col-span-full rounded-xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                        <AdminLoading message="Đang tải lịch làm việc..." />
                    </div>
                ) : schedule.length === 0 ? (
                    <div className="col-span-full flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center dark:border-zinc-700 dark:bg-zinc-900">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-zinc-800">
                            <Clock size={28} />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                            Chưa có ca làm trong tuần này
                        </p>
                        <p className="mt-2 text-xs font-bold text-slate-400 dark:text-slate-500">
                            Vui lòng kiểm tra lại tuần khác hoặc liên hệ quản lý.
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
                                    'rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900',
                                    isToday && 'border-orange-300 ring-2 ring-orange-100 dark:border-orange-700 dark:ring-orange-950/50',
                                )}
                            >
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                            {dateObj.toLocaleDateString('vi-VN', { weekday: 'long' })}
                                        </p>
                                        <p className="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                            {dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                        </p>
                                    </div>
                                    {isToday && (
                                        <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-600 dark:bg-orange-950/30 dark:text-orange-400">
                                            Hôm nay
                                        </span>
                                    )}
                                </div>

                                <div className="mb-5 flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-zinc-800/60">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600 dark:bg-zinc-900">
                                        <Briefcase size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
                                            {assign.shiftId?.name || 'Ca làm'}
                                        </h3>
                                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                            {assign.shiftId?.startTime} - {assign.shiftId?.endTime}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-5 grid grid-cols-2 gap-3">
                                    <div className="rounded-lg border border-slate-200 p-3 dark:border-zinc-800">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Check-in</p>
                                        <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                                            {hasCheckedIn
                                                ? new Date(assign.checkIn).toLocaleTimeString('vi-VN', {
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                  })
                                                : '--:--'}
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 p-3 dark:border-zinc-800">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Check-out</p>
                                        <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                                            {hasCheckedOut
                                                ? new Date(assign.checkOut).toLocaleTimeString('vi-VN', {
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                  })
                                                : '--:--'}
                                        </p>
                                    </div>
                                </div>

                                {hasCheckedOut ? (
                                    <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-50 py-3 text-xs font-black uppercase tracking-widest text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                                        <CheckCircle2 size={18} />
                                        Đã hoàn tất ca
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <button
                                            disabled={hasCheckedIn || !isToday}
                                            onClick={() => handleCheckIn(assign._id)}
                                            className={cn(
                                                'inline-flex h-11 items-center justify-center gap-2 rounded-lg text-xs font-black uppercase tracking-widest transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                                                hasCheckedIn
                                                    ? 'border border-slate-200 bg-slate-50 text-slate-500 dark:border-zinc-800 dark:bg-zinc-800'
                                                    : isToday
                                                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                                                      : 'border border-slate-200 bg-slate-50 text-slate-400 dark:border-zinc-800 dark:bg-zinc-800',
                                            )}
                                        >
                                            <CheckCircle2 size={17} />
                                            {hasCheckedIn ? 'Đã vào ca' : 'Vào ca'}
                                        </button>

                                        <button
                                            disabled={!hasCheckedIn || hasCheckedOut || !isToday}
                                            onClick={() => handleCheckOut(assign._id)}
                                            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-800"
                                        >
                                            <Timer size={17} />
                                            Ra ca
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-orange-100 bg-orange-50 p-4 dark:border-orange-900/30 dark:bg-orange-950/20 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-bold text-orange-800 dark:text-orange-300">
                    Chỉ có thể vào ca và ra ca trong ngày làm việc hiện tại.
                </p>
                <button
                    onClick={fetchSchedule}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-xs font-black uppercase tracking-widest text-orange-700 shadow-sm transition-colors hover:bg-orange-100 dark:bg-zinc-900 dark:text-orange-300 dark:hover:bg-zinc-800"
                >
                    <RefreshCw size={16} /> Làm mới lịch
                </button>
            </div>
        </AdminLayout>
    );
};

export default StaffSchedule;


