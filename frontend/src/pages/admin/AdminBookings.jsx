import React, { useEffect, useState, useMemo } from 'react';
import { getBookingsApi, updateBookingApi, cancelBookingApi } from '@/service/bookingApi.service';
import HeaderAdmin from '@/components/admin/shared/HeaderAdmin';
import SidebarAdmin from '@/components/admin/shared/SidebarAdmin';
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
} from 'lucide-react';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState(null);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await getBookingsApi();
            if (res.data?.success) setBookings(res.data.data || []);
        } catch (err) {
            console.error('Fetch bookings error', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateBookingApi(id, { status });
            fetchBookings();
        } catch (err) {
            console.error('Update status error', err);
        }
    };

    const handleCancel = async (id) => {
        try {
            await cancelBookingApi(id);
            fetchBookings();
        } catch (err) {
            console.error('Cancel booking error', err);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-amber-100 text-amber-800',
            confirmed: 'bg-emerald-100 text-emerald-800',
            completed: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return styles[status] || 'bg-slate-100 text-slate-800';
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
        try {
            await updateBookingApi(editFormData._id, editFormData);
            setIsEditModalOpen(false);
            fetchBookings();
        } catch (err) {
            console.error('Update booking error', err);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
            <HeaderAdmin />

            <div className="flex">
                <SidebarAdmin />

                <main className="flex-1 container mx-auto px-6 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Quản lý đặt bàn</h1>
                        <p className="text-slate-600">Theo dõi và quản lý các đặt bàn của khách hàng</p>
                    </div>

                    {/* Filters Section */}
                    <div className="mb-8 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Tìm kiếm và lọc</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tìm kiếm</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Tên khách hoặc SĐT..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="pending">Chờ xác nhận</option>
                                    <option value="confirmed">Đã xác nhận</option>
                                    <option value="completed">Hoàn thành</option>
                                    <option value="cancelled">Đã hủy</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Ngày</label>
                                <input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) =>
                                        setDateFilter(
                                            e.target.value ? new Date(e.target.value).toLocaleDateString('vi-VN') : '',
                                        )
                                    }
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {(searchQuery || statusFilter || dateFilter) && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <p className="text-sm text-slate-600">
                                    Kết quả:{' '}
                                    <span className="font-semibold text-slate-900">{filteredBookings.length}</span> đặt
                                    bàn
                                    {searchQuery && ` (tìm: "${searchQuery}")`}
                                    {statusFilter && ` (trạng thái: ${getStatusLabel(statusFilter)})`}
                                    {dateFilter && ` (ngày: ${dateFilter})`}
                                </p>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <Loader2 className="mx-auto mb-4 text-orange-500 animate-spin" size={32} />
                                <p className="text-slate-600">Đang tải danh sách đặt bàn...</p>
                            </div>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
                            <Calendar className="mx-auto mb-4 text-slate-400" size={32} />
                            <p className="text-slate-600 text-lg">Chưa có đặt bàn nào</p>
                            <p className="text-slate-500 text-sm mt-1">Các đặt bàn sẽ xuất hiện ở đây</p>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
                            <Filter className="mx-auto mb-4 text-slate-400" size={32} />
                            <p className="text-slate-600 text-lg">Không tìm thấy đặt bàn</p>
                            <p className="text-slate-500 text-sm mt-1">Thử điều chỉnh bộ lọc của bạn</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredBookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    {booking.customerName}
                                                </h3>
                                                <div
                                                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getStatusBadge(booking.status)}`}
                                                >
                                                    {getStatusLabel(booking.status)}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleEditClick(booking)}
                                                className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-orange-100 rounded-lg">
                                                    <Calendar size={18} className="text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium">Ngày</p>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Clock size={18} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium">Giờ</p>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {booking.bookingTime}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-100 rounded-lg">
                                                    <Users size={18} className="text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium">Số người</p>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {booking.numberOfGuests} khách
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <Phone size={18} className="text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium">SĐT</p>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {booking.customerPhone}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {booking.tableId && (
                                            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-slate-600" />
                                                    <div>
                                                        <p className="text-xs text-slate-500 font-medium">Bàn</p>
                                                        <p className="text-sm font-semibold text-slate-900">
                                                            {booking.tableId.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewDetails(booking)}
                                                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors"
                                            >
                                                Chi tiết
                                            </button>

                                            {booking.status !== 'confirmed' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                                                    className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Check size={16} />
                                                    Xác nhận
                                                </button>
                                            )}

                                            {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(booking._id, 'completed')}
                                                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Check size={16} />
                                                    Hoàn thành
                                                </button>
                                            )}

                                            {booking.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => handleCancel(booking._id)}
                                                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Detail Modal — redesigned */}
            {isDetailModalOpen && selectedBooking && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        {/* Header */}
                        <div className="relative bg-linear-to-br from-orange-500 via-orange-500 to-amber-400 px-8 py-6 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-8 w-16 h-16 bg-white/10 rounded-full translate-y-1/2" />
                            <div className="relative flex items-start justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm font-medium mb-1">Thông tin chi tiết</p>
                                    <h2 className="text-2xl font-bold text-white">{selectedBooking.customerName}</h2>
                                    <div className="mt-2">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/25 text-white`}
                                        >
                                            {getStatusLabel(selectedBooking.status)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="px-8 py-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-3 p-3.5 bg-orange-50 rounded-xl border border-orange-100">
                                    <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                                        <Calendar size={15} className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Ngày đặt</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {new Date(selectedBooking.bookingDate).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3.5 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                                        <Clock size={15} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Giờ đặt</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {selectedBooking.bookingTime}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <div className="p-2 bg-emerald-100 rounded-lg shrink-0">
                                        <Users size={15} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Số khách</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {selectedBooking.numberOfGuests} khách
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3.5 bg-purple-50 rounded-xl border border-purple-100">
                                    <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                                        <Phone size={15} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Số điện thoại</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {selectedBooking.customerPhone}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {selectedBooking.tableId && (
                                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="p-2 bg-slate-200 rounded-lg shrink-0">
                                        <User size={15} className="text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Bàn được xếp</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {selectedBooking.tableId.name}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {selectedBooking.notes && (
                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1.5">
                                        Ghi chú
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed">{selectedBooking.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={() => {
                                    setIsDetailModalOpen(false);
                                    handleEditClick(selectedBooking);
                                }}
                                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <Edit2 size={15} />
                                Chỉnh sửa
                            </button>
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="flex-1 px-4 py-2.5 bg-linear-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-orange-200"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal — redesigned */}
            {isEditModalOpen && editFormData && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        {/* Modal Header */}
                        <div className="relative bg-linear-to-br from-orange-500 via-orange-500 to-amber-400 px-8 py-6 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-8 w-16 h-16 bg-white/10 rounded-full translate-y-1/2" />
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm font-medium mb-1">Chỉnh sửa thông tin</p>
                                    <h2 className="text-2xl font-bold text-white">Đặt bàn</h2>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Form Body */}
                        <div className="px-8 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
                            {/* Tên khách & SĐT */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <User size={12} />
                                        Tên khách
                                    </label>
                                    <input
                                        type="text"
                                        value={editFormData.customerName}
                                        onChange={(e) =>
                                            setEditFormData({ ...editFormData, customerName: e.target.value })
                                        }
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-colors"
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <Phone size={12} />
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        value={editFormData.customerPhone}
                                        onChange={(e) =>
                                            setEditFormData({ ...editFormData, customerPhone: e.target.value })
                                        }
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-colors"
                                        placeholder="0901 234 567"
                                    />
                                </div>
                            </div>

                            {/* Ngày & Giờ */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <Calendar size={12} />
                                        Ngày đặt
                                    </label>
                                    <input
                                        type="date"
                                        value={editFormData.bookingDate}
                                        onChange={(e) =>
                                            setEditFormData({ ...editFormData, bookingDate: e.target.value })
                                        }
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-colors"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <Clock size={12} />
                                        Giờ đặt
                                    </label>
                                    <input
                                        type="time"
                                        value={editFormData.bookingTime}
                                        onChange={(e) =>
                                            setEditFormData({ ...editFormData, bookingTime: e.target.value })
                                        }
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Số người — stepper */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <Users size={12} />
                                    Số lượng khách
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditFormData({
                                                ...editFormData,
                                                numberOfGuests: Math.max(1, editFormData.numberOfGuests - 1),
                                            })
                                        }
                                        className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-orange-100 hover:text-orange-600 text-slate-600 rounded-xl font-bold text-lg transition-colors border border-slate-200"
                                    >
                                        −
                                    </button>
                                    <div className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-sm font-bold text-slate-900">
                                        {editFormData.numberOfGuests}{' '}
                                        <span className="font-normal text-slate-500">khách</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditFormData({
                                                ...editFormData,
                                                numberOfGuests: editFormData.numberOfGuests + 1,
                                            })
                                        }
                                        className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-orange-100 hover:text-orange-600 text-slate-600 rounded-xl font-bold text-lg transition-colors border border-slate-200"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Ghi chú */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                                    Ghi chú
                                </label>
                                <textarea
                                    value={editFormData.notes}
                                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-colors resize-none"
                                    rows="3"
                                    placeholder="Yêu cầu đặc biệt, dị ứng thực phẩm..."
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl font-medium text-sm transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="flex-1 px-4 py-2.5 bg-linear-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-orange-200 flex items-center justify-center gap-2"
                            >
                                Lưu thay đổi
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
