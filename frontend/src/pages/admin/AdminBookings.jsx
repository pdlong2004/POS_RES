import React, { useEffect, useState, useMemo } from 'react';
import { getBookingsApi, updateBookingApi, cancelBookingApi } from '@/service/bookingApi.service';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import AdminLoading from '@/components/admin/shared/AdminLoading';
import {
    Calendar,
    Clock,
    Users,
    Phone,
    User,
    Loader2,
    Check,
    X,
    Search,
    Filter,
    Edit2,
    ChevronRight,
    RefreshCw,
    MessageSquare,
    ChevronLeft,
    CheckCircle2,
    AlertCircle,
    LayoutGrid,
    Zap,
    MapPin,
    ArrowRight,
    Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

const AdminBookings = () => {
    const { toast } = useToast();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getBookingsApi();
            if (res.data?.success) setBookings(res.data.data || []);
        } catch (err) {
            console.error('Fetch bookings error', err);
            toast.error('Không thể tải danh sách đặt bàn');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateBookingApi(id, { status });
            toast.success(`Đã cập nhật trạng thái: ${getStatusLabel(status)}`);
            fetchData();
        } catch (err) {
            console.error('Update status error', err);
            toast.error('Cập nhật trạng thái thất bại');
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đặt bàn này?')) return;
        try {
            await cancelBookingApi(id);
            toast.success('Đã hủy lịch đặt bàn');
            fetchData();
        } catch (err) {
            console.error('Cancel booking error', err);
            toast.error('Hủy đặt bàn thất bại');
        }
    };

    const getStatusStyles = (status) => {
        const styles = {
            pending: 'bg-amber-50 text-amber-600 border-amber-100',
            confirmed: 'bg-orange-50 text-orange-600 border-orange-100',
            completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            cancelled: 'bg-rose-50 text-rose-600 border-rose-100',
        };
        return styles[status] || 'bg-slate-50 text-slate-500 border-slate-100';
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Chờ xác nhận',
            confirmed: 'Đã xác nhận',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy',
        };
        return labels[status] || status;
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const matchesSearch =
                !searchQuery ||
                booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.customerPhone.includes(searchQuery);
            const matchesStatus = !statusFilter || booking.status === statusFilter;
            const matchesDate = !dateFilter || new Date(booking.bookingDate).toLocaleDateString('vi-VN') === dateFilter;
            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [bookings, searchQuery, statusFilter, dateFilter]);

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setIsDetailModalOpen(true);
    };

    const handleEditClick = (booking) => {
        setEditFormData({
            _id: booking._id,
            customerName: booking.customerName,
            customerPhone: booking.customerPhone,
            bookingDate: booking.bookingDate.split('T')[0],
            bookingTime: booking.bookingTime,
            numberOfGuests: booking.numberOfGuests,
            notes: booking.notes || '',
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        setIsSubmitting(true);
        try {
            await updateBookingApi(editFormData._id, editFormData);
            toast.success('Đã cập nhật thông tin đặt bàn');
            setIsEditModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Update booking error', err);
            toast.error('Cập nhật thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout className="space-y-10">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Lịch đặt chỗ</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                        Quản lý ma trận đặt bàn và điều phối không gian đón tiếp khách hàng.
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <button
                        onClick={fetchData}
                        className="admin-btn-secondary w-12 h-12 flex items-center justify-center p-0 dark:bg-zinc-900/50 dark:border-zinc-800"
                        title="Làm mới"
                    >
                        <RefreshCw size={18} className={cn(loading && 'animate-spin')} />
                    </button>
                    <div className="flex items-center gap-2 text-xs font-black text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 px-6 py-3 rounded-2xl border border-orange-100 dark:border-orange-900/30 uppercase tracking-widest">
                        <Zap size={14} /> Live
                    </div>
                </div>
            </div>

            {/* FILTERS BAR */}
            <div className="admin-card p-6 border-white/20 dark:border-zinc-800/50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 bg-white/50 dark:bg-zinc-900/50">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-5 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-600 group-focus-within:text-orange-600 dark:group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm khách hàng..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="admin-input pl-12 h-14 bg-white/50 dark:bg-zinc-900 border-white dark:border-zinc-800 text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="md:col-span-4 relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="admin-input h-14 bg-white/50 dark:bg-zinc-900 border-white dark:border-zinc-800 appearance-none cursor-pointer font-bold text-xs uppercase tracking-widest px-6 text-slate-900 dark:text-white"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="pending">Chờ xác nhận</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="completed">Hoàn tất phục vụ</option>
                            <option value="cancelled">Đã hủy bỏ</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <Filter size={14} />
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        <input
                            type="date"
                            onChange={(e) =>
                                setDateFilter(
                                    e.target.value
                                        ? new Date(e.target.value).toLocaleDateString('vi-VN')
                                        : '',
                                )
                            }
                            className="admin-input h-14 bg-white/50 dark:bg-zinc-900 border-white dark:border-zinc-800 font-bold uppercase tracking-widest text-xs text-slate-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center gap-4">
                        <RefreshCw className="h-8 w-8 text-orange-600 dark:text-orange-500 animate-spin" />
                        <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">
                            Đang tải dữ liệu...
                        </p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="admin-card py-32 flex flex-col items-center justify-center bg-white/30 dark:bg-zinc-900/30 border-white dark:border-zinc-800 rounded-[3rem]">
                        <div className="w-24 h-24 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-8 border border-white dark:border-zinc-800 shadow-xl dark:shadow-none opacity-30">
                            <Calendar size={48} strokeWidth={1} className="text-slate-900 dark:text-white" />
                        </div>
                        <p className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-base">
                            Không tìm thấy dữ liệu
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="admin-card group hover:border-orange-400/40 dark:hover:border-orange-900 transition-all duration-500 overflow-hidden bg-white/50 dark:bg-zinc-900/50 border-white/40 dark:border-zinc-800/50"
                            >
                                <div className="p-8 space-y-8">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="min-w-0">
                                            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors truncate">
                                                {booking.customerName}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-4">
                                                <span
                                                    className={cn(
                                                        'px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border',
                                                        getStatusStyles(booking.status),
                                                    )}
                                                >
                                                    {getStatusLabel(booking.status)}
                                                </span>
                                                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-bold tabular-nums">
                                                    <Phone size={14} className="text-orange-600 dark:text-orange-500" />
                                                    {booking.customerPhone}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleEditClick(booking)}
                                            className="w-12 h-12 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-100 dark:hover:border-orange-900 rounded-2xl flex items-center justify-center transition-all shadow-sm"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6 py-8 border-y border-slate-100 dark:border-zinc-800">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                Thời gian
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-orange-600 dark:text-orange-500" />
                                                <p className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                                                    {booking.bookingTime}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                Ngày đến
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-orange-600 dark:text-orange-500" />
                                                <p className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                                                    {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                Số khách
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Users size={16} className="text-orange-600 dark:text-orange-500" />
                                                <p className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                                                    {booking.numberOfGuests}p
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {booking.tableId ? (
                                            <div className="flex items-center gap-4 p-4 bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl">
                                                <div className="w-10 h-10 bg-orange-600 dark:bg-orange-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg dark:shadow-none shadow-orange-100">
                                                    <LayoutGrid size={18} className="text-white" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest leading-none mb-1">
                                                        Vị trí bàn
                                                    </p>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                                                        {booking.tableId.name}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-zinc-800/50 border border-dashed border-slate-200 dark:border-zinc-700 rounded-2xl">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-slate-300 dark:text-slate-600">
                                                    <MapPin size={18} />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                    Chưa gán vị trí
                                                </p>
                                            </div>
                                        )}

                                        {booking.notes && (
                                            <div className="flex items-start gap-4 p-4 bg-slate-50/50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 rounded-2xl">
                                                <MessageSquare size={14} className="text-orange-600 dark:text-orange-500 mt-1 shrink-0" />
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 italic leading-relaxed">
                                                    "{booking.notes}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <button
                                            onClick={() => handleViewDetails(booking)}
                                            className="flex-1 px-6 py-4 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all flex items-center justify-center"
                                        >
                                            Chi tiết <ArrowRight size={14} className="ml-2" />
                                        </button>

                                        {booking.status === 'pending' && (
                                            <button
                                                onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                                                className="flex-[1.5] px-6 py-4 rounded-2xl bg-orange-600 text-white text-xs font-black uppercase tracking-widest hover:bg-orange-700 shadow-lg dark:shadow-none shadow-orange-100 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Check size={16} /> Xác nhận
                                            </button>
                                        )}

                                        {booking.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleUpdateStatus(booking._id, 'completed')}
                                                className="flex-[1.5] px-6 py-4 rounded-2xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg dark:shadow-none shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Zap size={16} /> Hoàn tất
                                            </button>
                                        )}

                                        {booking.status !== 'cancelled' &&
                                            booking.status !== 'completed' && (
                                                <button
                                                    onClick={() => handleCancel(booking._id)}
                                                    className="w-14 h-14 flex items-center justify-center bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"
                                                    title="Hủy đặt chỗ"
                                                >
                                                    <X size={20} />
                                                </button>
                                            )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODALS */}
            {isDetailModalOpen && selectedBooking && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white dark:border-zinc-800 animate-in zoom-in-95 duration-500">
                         <div className="p-10 space-y-8 bg-white/50 dark:bg-zinc-900/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-orange-600 dark:bg-orange-500 flex items-center justify-center text-white shadow-lg dark:shadow-none shadow-orange-100">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{selectedBooking.customerName}</h2>
                                        <p className="text-orange-600 dark:text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Customer Profile</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                                    <X size={20} className="text-slate-400 dark:text-slate-500" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</p>
                                    <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", getStatusStyles(selectedBooking.status), "dark:bg-opacity-20 dark:border-opacity-30")}>
                                        {getStatusLabel(selectedBooking.status)}
                                    </span>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Phone</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white tabular-nums">{selectedBooking.customerPhone}</p>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Schedule</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                                        {selectedBooking.bookingTime} / {new Date(selectedBooking.bookingDate).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Pax</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white tabular-nums">{selectedBooking.numberOfGuests} guests</p>
                                </div>
                            </div>

                            {selectedBooking.notes && (
                                <div className="p-8 bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-3xl relative overflow-hidden">
                                    <MessageSquare size={60} className="absolute -right-2 -bottom-2 text-orange-100 dark:text-orange-950/30 rotate-12" />
                                    <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-2">Notes</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 italic font-medium relative z-10">"{selectedBooking.notes}"</p>
                                </div>
                            )}

                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl dark:shadow-none shadow-slate-200"
                            >
                                Close Details
                            </button>
                         </div>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {isEditModalOpen && editFormData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white dark:border-zinc-800 animate-in zoom-in-95 duration-500">
                        <div className="p-10 space-y-10 bg-white/50 dark:bg-zinc-900/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                        <Settings size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Edit Booking</h2>
                                        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Configure Parameters</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                                    <X size={20} className="text-slate-400 dark:text-slate-500" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Customer Name</label>
                                    <input
                                        type="text"
                                        value={editFormData.customerName}
                                        onChange={(e) => setEditFormData({ ...editFormData, customerName: e.target.value })}
                                        className="admin-input h-14 font-bold bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={editFormData.customerPhone}
                                        onChange={(e) => setEditFormData({ ...editFormData, customerPhone: e.target.value })}
                                        className="admin-input h-14 font-bold bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Date</label>
                                    <input
                                        type="date"
                                        value={editFormData.bookingDate}
                                        onChange={(e) => setEditFormData({ ...editFormData, bookingDate: e.target.value })}
                                        className="admin-input h-14 font-bold bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Time</label>
                                    <input
                                        type="time"
                                        value={editFormData.bookingTime}
                                        onChange={(e) => setEditFormData({ ...editFormData, bookingTime: e.target.value })}
                                        className="admin-input h-14 font-bold bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Pax Size</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setEditFormData({ ...editFormData, numberOfGuests: Math.max(1, editFormData.numberOfGuests - 1) })}
                                        className="w-14 h-14 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl flex items-center justify-center text-xl font-bold text-slate-900 dark:text-white shadow-sm hover:border-orange-600 dark:hover:border-orange-500 transition-all"
                                    >
                                        −
                                    </button>
                                    <div className="flex-1 h-14 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center font-black text-xl text-slate-900 dark:text-white">
                                        {editFormData.numberOfGuests}
                                    </div>
                                    <button
                                        onClick={() => setEditFormData({ ...editFormData, numberOfGuests: editFormData.numberOfGuests + 1 })}
                                        className="w-14 h-14 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl flex items-center justify-center text-xl font-bold text-slate-900 dark:text-white shadow-sm hover:border-orange-600 dark:hover:border-orange-500 transition-all"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-4 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 rounded-2xl bg-orange-600 text-white text-xs font-black uppercase tracking-widest hover:bg-orange-700 shadow-xl dark:shadow-none shadow-orange-100 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminBookings;


