import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import AdminLoading from '@/components/admin/shared/AdminLoading';
import {
    Calendar,
    Clock,
    Plus,
    Filter,
    UserCheck,
    ChevronLeft,
    ChevronRight,
    Settings,
    X,
    Loader2,
    Sparkles,
    RefreshCw,
    User,
    Briefcase,
    Zap,
    CalendarDays,
    ArrowRight,
    CheckCircle2,
    Info,
} from 'lucide-react';
import {
    getShiftsApi,
    getStaffApi,
    getScheduleApi,
    createShiftApi,
    assignShiftApi,
    autoScheduleApi,
} from '@/service/staff.service';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const ShiftManagement = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const roleName = (user?.roleId?.name || user?.role || '').toString().toLowerCase();
    const isAdmin = roleName === 'admin';

    const [shifts, setShifts] = useState([]);
    const [staff, setStaff] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // New Shift Form State
    const [newShift, setNewShift] = useState({
        name: '',
        startTime: '08:00',
        endTime: '17:00',
        type: 'morning',
    });

    // Date range state (Starting Monday of current week)
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

    const [selectedShiftDetails, setSelectedShiftDetails] = useState(null);
    const [assigningData, setAssigningData] = useState(null); // { staff, date }

    const formatLocalYMD = (dateStringOrObj) => {
        if (!dateStringOrObj) return '';
        const d = new Date(dateStringOrObj);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [shiftRes, staffRes, scheduleRes] = await Promise.all([
                getShiftsApi(),
                getStaffApi(),
                getScheduleApi({
                    start: formatLocalYMD(startDate),
                    end: formatLocalYMD(weekDays[6]),
                }),
            ]);

            setShifts(shiftRes.data.data);
            setStaff(staffRes.data.data);
            setSchedule(scheduleRes.data.data);
        } catch (error) {
            console.error('Failed to fetch shift data', error);
            toast.error('Không thể tải dữ liệu lịch làm việc');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate]);

    const handleCreateShift = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createShiftApi(newShift);
            toast.success('Tạo ca làm việc mới thành công');
            setShowModal(false);
            setNewShift({ name: '', startTime: '08:00', endTime: '17:00', type: 'morning' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể tạo ca làm');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAssignShift = async (shiftId) => {
        try {
            const payload = {
                accountId: assigningData.staff._id,
                shiftId,
                date: formatLocalYMD(assigningData.date),
            };
            const res = await assignShiftApi(payload);

            if (res.data.success) {
                toast.success(`Đã phân ca cho ${assigningData.staff.name}`);
                setAssigningData(null);
                fetchData();
            } else {
                throw new Error(res.data.message || 'Lỗi từ máy chủ');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Không thể phân ca');
        }
    };

    const handleAutoSchedule = async () => {
        if (
            !window.confirm('Bạn có muốn tự động lấp đầy lịch tuần này bằng AI? Các ca đã được gán sẽ được giữ nguyên.')
        )
            return;

        try {
            setLoading(true);
            const payload = {
                startDate: formatLocalYMD(startDate),
                endDate: formatLocalYMD(weekDays[6]),
            };
            const res = await autoScheduleApi(payload);
            if (res.data.success) {
                toast.success(`Đã tự động tạo ${res.data.count} lượt phân ca thành công!`);
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi tự động phân ca');
            setLoading(false);
        }
    };

    const changeWeek = (direction) => {
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + direction * 7);
        setStartDate(newDate);
    };

    const getAssignment = (staffId, date) => {
        const dStr = formatLocalYMD(date);
        return (schedule || []).find((s) => {
            const sDateStr = formatLocalYMD(s.date);
            const sId = (s.accountId?._id || s.accountId || '').toString();
            return sId === staffId.toString() && sDateStr === dStr;
        });
    };

    const getShiftColor = (shift) => {
        if (!shift) return 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-zinc-700';

        const name = (shift.name || '').toLowerCase();
        const startHour = parseInt((shift.startTime || '00').split(':')[0]);

        if (name.includes('gãy') || name.includes('cả ngày') || name.includes('full')) {
            return 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30 shadow-rose-100/50 dark:shadow-none';
        } else if (name.includes('sáng') || (startHour >= 5 && startHour < 12)) {
            return 'bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-900/30 shadow-sky-100/50 dark:shadow-none';
        } else if (name.includes('chiều') || (startHour >= 12 && startHour < 17)) {
            return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30 shadow-amber-100/50 dark:shadow-none';
        } else if (name.includes('tối') || name.includes('đêm') || startHour >= 17) {
            return 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/30 shadow-orange-100/50 dark:shadow-none';
        } else {
            return 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/30 shadow-orange-100/50 dark:shadow-none';
        }
    };

    const handleShiftClick = (shift) => {
        const workers = staff.filter((s) => {
            const hasShift = (schedule || []).some((sch) => {
                const sId = (sch.accountId?._id || sch.accountId || '').toString();
                const shId = (sch.shiftId?._id || sch.shiftId || '').toString();
                return sId === s._id.toString() && shId === shift._id.toString();
            });
            return hasShift;
        });
        setSelectedShiftDetails({ shift, workers });
    };

    return (
        <AdminLayout className="space-y-12">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Quản lý ca làm</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm italic">
                        Tối ưu hóa nguồn lực nhân sự bằng thuật toán phân ca tự động AI.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <button
                        onClick={fetchData}
                        className="admin-btn-secondary w-12 h-12 flex items-center justify-center p-0 rounded-2xl dark:bg-zinc-900/50 dark:border-zinc-800"
                        title="Làm mới"
                    >
                        <RefreshCw size={18} className={cn(loading && 'animate-spin')} />
                    </button>

                    <div className="flex items-center bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[1.5rem] p-1.5 shadow-sm">
                        <button
                            onClick={() => changeWeek(-1)}
                            className="p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-500 rounded-xl transition-all active:scale-90"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="px-6 text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest min-w-[240px] text-center flex items-center justify-center gap-3">
                            {startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                            <ArrowRight size={14} className="text-orange-600 dark:text-orange-500" />
                            {weekDays[6].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                        </span>
                        <button
                            onClick={() => changeWeek(1)}
                            className="p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-500 rounded-xl transition-all active:scale-90"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {isAdmin && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleAutoSchedule}
                                className="h-14 px-8 bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3 shadow-lg shadow-orange-100/50 dark:shadow-none"
                            >
                                <Sparkles size={18} /> AI Schedule
                            </button>
                            <button
                                onClick={() => setShowModal(true)}
                                className="h-14 px-8 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-100 dark:shadow-none transition-all flex items-center gap-3"
                            >
                                <Plus size={20} /> Tạo ca mới
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* SHIFTS REPOSITORY */}
                <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                    <div className="admin-card p-0 border-white/40 dark:border-zinc-800/50 overflow-hidden rounded-[2.5rem] shadow-sm bg-white/30 dark:bg-zinc-900/30">
                        <div className="p-8 border-b border-slate-50 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-800/20 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-100 dark:shadow-none">
                                <Clock size={18} />
                            </div>
                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                Danh mục ca làm
                            </span>
                        </div>
                        <div className="p-8 space-y-4">
                            {shifts.map((s) => (
                                <button
                                    key={s._id}
                                    onClick={() => handleShiftClick(s)}
                                    className="w-full text-left group p-5 bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-100 dark:border-zinc-800 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50/30 dark:hover:bg-orange-950/20 transition-all active:scale-[0.97] relative overflow-hidden shadow-sm"
                                >
                                    <div className="absolute left-0 top-0 w-2 h-full bg-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <p className="font-black text-slate-900 dark:text-white text-sm group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors uppercase tracking-tight">
                                        {s.name}
                                    </p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-tighter tabular-nums flex items-center gap-1.5">
                                            <Clock size={12} /> {s.startTime} — {s.endTime}
                                        </p>
                                        <span
                                            className={cn(
                                                'text-[9px] font-black uppercase px-2 py-0.5 rounded-md border',
                                                getShiftColor(s),
                                            )}
                                        >
                                            {s.type}
                                        </span>
                                    </div>
                                </button>
                            ))}
                            {shifts.length === 0 && (
                                <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] opacity-50">
                                    <Info className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        Cơ sở dữ liệu trống
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ACTIVE WORKERS INSIGHT */}
                    {selectedShiftDetails && (
                        <div className="admin-card p-0 border-orange-200 dark:border-orange-500/30 bg-white dark:bg-zinc-900 shadow-2xl shadow-orange-100 dark:shadow-none animate-in zoom-in-95 duration-300 overflow-hidden rounded-[2.5rem]">
                            <div className="p-8 bg-orange-600 flex items-center justify-between">
                                <div>
                                    <h3 className="text-[10px] font-black text-white/70 uppercase tracking-widest leading-none">
                                        Phân tích ca
                                    </h3>
                                    <p className="text-lg font-black text-white mt-1 uppercase tracking-tight">
                                        {selectedShiftDetails.shift.name}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedShiftDetails(null)}
                                    className="p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-8 space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide bg-orange-50/30 dark:bg-zinc-800/30">
                                {selectedShiftDetails.workers.map((w) => (
                                    <div
                                        key={w._id}
                                        className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-orange-100 dark:border-orange-500/30 group transition-all shadow-sm"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black text-xs border border-orange-100 dark:border-orange-500/30 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                                            {w.image ? (
                                                <img src={w.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                w.name.charAt(0)
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors tracking-tight uppercase">
                                                {w.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-0.5 truncate italic">
                                                {w.employeeInfo?.position || 'Nhân sự vận hành'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {selectedShiftDetails.workers.length === 0 && (
                                    <div className="py-12 text-center opacity-40">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            Trống nhân sự tuần này
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* MAIN SCHEDULING INTERFACE */}
                <div className="lg:col-span-9 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                    <div className="admin-card p-0 border-white/40 dark:border-zinc-800/50 overflow-hidden rounded-[2.5rem] shadow-sm bg-white/30 dark:bg-zinc-900/30">
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-zinc-800/50 backdrop-blur-xl border-b border-slate-100 dark:border-zinc-800">
                                        <th className="px-8 py-8 min-w-[280px] sticky left-0 bg-slate-50 dark:bg-zinc-800 z-30 border-r border-slate-100 dark:border-zinc-700 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg dark:shadow-none">
                                                <User size={20} />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Hồ sơ nhân sự</span>
                                        </th>
                                        {weekDays.map((day, i) => (
                                            <th key={i} className="px-6 py-8 text-center min-w-[150px]">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                                        {day.toLocaleDateString('vi-VN', {
                                                            weekday: 'short',
                                                        })}
                                                    </p>
                                                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                                                        {day.getDate()}
                                                    </p>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8">
                                                <AdminLoading message="Đang ánh xạ lịch trình công tác..." />
                                            </td>
                                        </tr>
                                    ) : (
                                        staff.map((s) => (
                                            <tr key={s._id} className="group hover:bg-slate-50/30 transition-colors">
                                                <td className="px-8 py-6 sticky left-0 bg-white z-20 border-r border-slate-100 group-hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-110 transition-transform duration-500 overflow-hidden shadow-sm">
                                                            {s.image ? (
                                                                <img src={s.image} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                s.name.charAt(0)
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-black text-slate-900 group-hover:text-orange-600 transition-colors text-base truncate tracking-tight uppercase">
                                                                {s.name}
                                                            </p>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 truncate italic">
                                                                {s.employeeInfo?.position || 'STAFF'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                {weekDays.map((day, i) => {
                                                    const assign = getAssignment(s._id, day);
                                                    return (
                                                        <td
                                                            key={i}
                                                            className={cn(
                                                                'px-4 py-6 text-center transition-all duration-300',
                                                                isAdmin && 'cursor-pointer hover:bg-orange-50/50',
                                                            )}
                                                            onClick={() =>
                                                                isAdmin &&
                                                                setAssigningData({ staff: s, date: day })
                                                            }
                                                        >
                                                            {assign ? (
                                                                <div
                                                                    className={cn(
                                                                        'inline-flex items-center justify-center w-full px-4 py-3 text-[10px] font-black rounded-2xl border shadow-sm transition-all hover:scale-105 active:scale-95 uppercase tracking-tighter',
                                                                        getShiftColor(assign.shiftId),
                                                                    )}
                                                                >
                                                                    {assign.shiftId?.name}
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className={cn(
                                                                        'w-12 h-12 rounded-2xl border-2 border-dashed flex items-center justify-center mx-auto transition-all duration-500 group/slot',
                                                                        isAdmin
                                                                            ? 'bg-transparent border-slate-100 hover:border-orange-400 hover:bg-white text-transparent hover:text-orange-400'
                                                                            : 'border-transparent',
                                                                    )}
                                                                >
                                                                    {isAdmin && <Plus size={20} />}
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK ASSIGN MODAL */}
            {assigningData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white dark:border-zinc-800">
                        <div className="px-10 py-10 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-800/50">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-100 dark:shadow-none">
                                    <CalendarDays size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">
                                        Phân ca nhanh
                                    </h3>
                                    <p className="text-[10px] text-orange-600 dark:text-orange-500 uppercase font-black tracking-[0.2em] mt-2">
                                        {assigningData.staff.name} <span className="opacity-20 mx-2">|</span>{' '}
                                        {new Date(assigningData.date).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAssigningData(null)}
                                className="p-3 text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-zinc-800 rounded-2xl transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-10 space-y-6 max-h-[500px] overflow-y-auto scrollbar-hide">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center mb-4 italic">
                                Lựa chọn khung giờ khả dụng:
                            </p>
                            <div className="grid grid-cols-1 gap-4">
                                {shifts.map((shift) => (
                                    <button
                                        key={shift._id}
                                        onClick={() => handleAssignShift(shift._id)}
                                        className="w-full p-6 flex justify-between items-center bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2rem] hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-zinc-800/50 group transition-all active:scale-[0.98] shadow-sm"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div
                                                className={cn(
                                                    'w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 shadow-sm',
                                                    getShiftColor(shift),
                                                )}
                                            >
                                                <Clock size={24} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors text-lg uppercase tracking-tight">
                                                    {shift.name}
                                                </p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase mt-1 tracking-widest tabular-nums italic">
                                                    {shift.startTime} — {shift.endTime}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-orange-600 dark:group-hover:text-orange-500 group-hover:border-orange-400 dark:group-hover:border-orange-500 transition-all">
                                            <Plus size={20} />
                                        </div>
                                    </button>
                                ))}
                                {shifts.length === 0 && (
                                    <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-zinc-800 rounded-[3rem] opacity-50">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                            Chưa định nghĩa ca làm
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-10 bg-slate-50/50 dark:bg-zinc-800/50 border-t border-slate-100 dark:border-zinc-800">
                            <button
                                className="w-full h-16 rounded-2xl text-[10px] font-black text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-zinc-700 transition-all uppercase tracking-[0.2em]"
                                onClick={() => setAssigningData(null)}
                            >
                                Hủy bỏ lựa chọn
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* NEW SHIFT MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-white dark:border-zinc-800 animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                        <div className="p-12 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-800/50">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-3xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-100 dark:shadow-none">
                                    <Zap size={32} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">
                                        Cấu hình ca làm
                                    </h2>
                                    <p className="text-orange-600 dark:text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3">
                                        Định nghĩa khung thời gian vận hành
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-3 text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-zinc-800 rounded-2xl transition-all"
                            >
                                <X size={28} />
                            </button>
                        </div>
                        <form
                            onSubmit={handleCreateShift}
                            className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-hide bg-white/50 dark:bg-zinc-900/50"
                        >
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                                    Tên định danh ca làm <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    required
                                    placeholder="CA SÁNG TỔNG HỢP"
                                    className="admin-input h-20 font-black text-3xl uppercase tracking-tighter bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                                    value={newShift.name}
                                    onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                                        Thời điểm bắt đầu
                                    </label>
                                    <div className="relative group">
                                        <Clock
                                            size={20}
                                            className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400 dark:text-orange-500"
                                        />
                                        <input
                                            type="time"
                                            className="admin-input h-16 pl-16 font-black text-2xl tabular-nums bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                                            value={newShift.startTime}
                                            onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                                        Thời điểm kết thúc
                                    </label>
                                    <div className="relative group">
                                        <Clock
                                            size={20}
                                            className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400 dark:text-orange-500"
                                        />
                                        <input
                                            type="time"
                                            className="admin-input h-16 pl-16 font-black text-2xl tabular-nums bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                                            value={newShift.endTime}
                                            onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                                    Phân loại khung giờ
                                </label>
                                <select
                                    className="admin-input h-16 font-black bg-white dark:bg-zinc-900 cursor-pointer text-xs uppercase tracking-[0.2em] appearance-none px-6 text-slate-900 dark:text-white"
                                    value={newShift.type}
                                    onChange={(e) => setNewShift({ ...newShift, type: e.target.value })}
                                >
                                    <option value="morning" className="dark:bg-zinc-900">MORNING_SHIFT (Standard 06-12)</option>
                                    <option value="afternoon" className="dark:bg-zinc-900">AFTERNOON_SHIFT (Standard 12-18)</option>
                                    <option value="night" className="dark:bg-zinc-900">NIGHT_SHIFT (Standard 18-00)</option>
                                    <option value="full" className="dark:bg-zinc-900">FULLTIME_SHIFT / SPLIT_SHIFT (Custom)</option>
                                </select>
                            </div>

                            <div className="p-10 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-[3rem] flex items-start gap-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-900/30 text-orange-600 dark:text-orange-400 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                    <Sparkles size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-[0.2em] mb-2">
                                        Hệ thống AI Insights
                                    </p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-bold italic">
                                        Dữ liệu ca làm mới sẽ được AI phân tích và tự động đưa vào ma trận tối ưu hóa lịch trình để đảm bảo hiệu suất vận hành cao nhất.
                                    </p>
                                </div>
                            </div>
                        </form>
                        <div className="p-12 border-t border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-800/50 flex gap-6">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                disabled={isSubmitting}
                                className="flex-1 h-16 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all active:scale-95"
                            >
                                Hủy bỏ thao tác
                            </button>
                            <button
                                onClick={handleCreateShift}
                                disabled={isSubmitting}
                                className="flex-1 h-16 rounded-2xl bg-orange-600 text-white text-xs font-black uppercase tracking-widest hover:bg-orange-700 shadow-xl shadow-orange-100 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <CheckCircle2 size={20} /> Xác thực thiết lập
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ShiftManagement;

