import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '@/components/admin/shared/SidebarAdmin';
import HeaderAdmin from '@/components/admin/shared/HeaderAdmin';
import invoiceService from '@/service/invoiceApi.service';
import { getOrderById, updateOrdersStatus } from '@/service/order.service';
import { Search, Calendar, Filter, Loader2, Eye, X } from 'lucide-react';

const AdminOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await invoiceService.getAllInvoices();
                const list = res?.data ?? res ?? [];
                setOrders(Array.isArray(list) ? list : []);
            } catch (err) {
                console.error('Failed to load orders', err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    const filtered = useMemo(() => {
        return orders.filter((o) => {
            if (search) {
                const q = search.toLowerCase();
                if (o._id?.toLowerCase().includes(q)) return true;
                if (o.table?.name?.toLowerCase().includes(q)) return true;
            }

            if (from) {
                const fromDate = new Date(from);
                if (new Date(o.createdAt) < fromDate) return false;
            }
            if (to) {
                const toDate = new Date(to);
                if (new Date(o.createdAt) > toDate) return false;
            }

            return true;
        });
    }, [orders, search, from, to]);

    const formatPrice = (p) => `${Number(p).toLocaleString('vi-VN')}đ`;

    const [detailOpen, setDetailOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('pending');

    const openDetail = async (id) => {
        setDetailOpen(true);
        setDetailLoading(true);
        try {
            const res = await invoiceService.getInvoiceById(id);
            const payload = res?.data ?? res ?? null;
            const invoice = payload?.data ?? payload ?? null;
            setSelectedInvoice(invoice);
            if (invoice?.orderIds && invoice.orderIds.length) {
                try {
                    const ord = await getOrderById(invoice.orderIds[0]);
                    const ordObj = ord?.data ?? ord ?? null;
                    setSelectedStatus(ordObj?.status || 'pending');
                } catch (e) {
                    setSelectedStatus('pending');
                }
            } else {
                setSelectedStatus('pending');
            }
        } catch (err) {
            console.error('Failed to load invoice detail', err);
            setSelectedInvoice(null);
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetail = () => {
        setDetailOpen(false);
        setSelectedInvoice(null);
    };

    const getStatusBadge = (status) => {
        if (!status) return 'bg-slate-100 text-slate-800';
        const s = status.toLowerCase();
        if (s.includes('pending') || s.includes('chờ')) return 'bg-yellow-100 text-yellow-800';
        if (s.includes('received') || s.includes('tiếp')) return 'bg-blue-100 text-blue-800';
        if (s.includes('processing') || s.includes('chế')) return 'bg-purple-100 text-purple-800';
        if (s.includes('served') || s.includes('phục')) return 'bg-emerald-100 text-emerald-800';
        if (s.includes('cancelled') || s.includes('hủy')) return 'bg-red-100 text-red-800';
        return 'bg-slate-100 text-slate-800';
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
            <HeaderAdmin />

            <div className="flex">
                <SidebarAdmin />

                <main className="flex-1 container mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Quản lý hóa đơn</h1>
                        <p className="text-slate-600">Theo dõi và thay đổi trạng thái của các hóa đơn</p>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Filter size={20} className="text-orange-600" />
                            <h2 className="text-lg font-semibold text-slate-900">Bộ lọc</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                                    size={18}
                                />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Tìm ID đơn hoặc bàn..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-500 text-sm"
                                />
                            </div>

                            {/* From Date */}
                            <div className="relative">
                                <Calendar
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                                    size={18}
                                />
                                <input
                                    type="date"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-slate-900 text-sm"
                                />
                            </div>

                            {/* To Date */}
                            <div className="relative">
                                <Calendar
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                                    size={18}
                                />
                                <input
                                    type="date"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-slate-900 text-sm"
                                />
                            </div>

                            {/* Reset Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    setFrom('');
                                    setTo('');
                                    setSearch('');
                                }}
                                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors duration-200"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Orders List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <Loader2 className="mx-auto mb-4 text-orange-500 animate-spin" size={32} />
                                <p className="text-slate-600 text-lg">Đang tải đơn hàng...</p>
                            </div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                            <p className="text-slate-600 text-lg font-medium">Không có đơn hàng nào</p>
                            <p className="text-slate-500 text-sm mt-1">Hãy thử thay đổi bộ lọc</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filtered.map((o, idx) => (
                                <div
                                    key={o._id}
                                    className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                                >
                                    <div className="p-6 flex items-center justify-between gap-4">
                                        {/* Left Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="inline-block text-xs font-bold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">
                                                            #{idx + 1}
                                                        </span>
                                                        <h3 className="text-sm font-medium text-slate-600">
                                                            ID: {o._id.slice(-6)}
                                                        </h3>
                                                    </div>
                                                    <p className="text-slate-900 font-semibold text-lg">
                                                        {o.table?.name || 'Bàn không xác định'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 text-sm">
                                                <div>
                                                    <span className="text-slate-600">Tổng tiền:</span>
                                                    <p className="text-slate-900 font-bold text-lg">
                                                        {formatPrice(o.totalPrice || o.itemsSubtotal || 0)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600">Thanh toán:</span>
                                                    <p className={`font-medium ${getStatusBadge(o.paymentStatus)}`}>
                                                        {o.paymentStatus || 'Chờ'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Badge and Action */}
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <span className="text-xs text-slate-500">Trạng thái</span>
                                                <div
                                                    className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusBadge(o.status)}`}
                                                >
                                                    {o.status || 'Chờ'}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => openDetail(o._id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm"
                                            >
                                                <Eye size={18} />
                                                <span className="hidden sm:inline">Chi tiết</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Detail Modal */}
                    {detailOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                    <h3 className="text-2xl font-bold text-slate-900">Chi tiết hóa đơn</h3>
                                    <button
                                        onClick={closeDetail}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                    >
                                        <X size={24} className="text-slate-500" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    {detailLoading && (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="text-center">
                                                <Loader2
                                                    className="mx-auto mb-3 text-orange-500 animate-spin"
                                                    size={32}
                                                />
                                                <p className="text-slate-600">Đang tải chi tiết...</p>
                                            </div>
                                        </div>
                                    )}

                                    {!detailLoading && !selectedInvoice && (
                                        <div className="p-6 text-center text-red-500">Không thể tải hóa đơn</div>
                                    )}

                                    {!detailLoading && selectedInvoice && (
                                        <div className="space-y-6">
                                            {/* Invoice Details Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Left Column */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                            ID Đơn
                                                        </label>
                                                        <div className="mt-1 p-3 bg-slate-50 rounded-lg text-slate-900 font-medium">
                                                            {selectedInvoice._id}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                            Bàn
                                                        </label>
                                                        <div className="mt-1 p-3 bg-slate-50 rounded-lg text-slate-900 font-medium">
                                                            {selectedInvoice.table?.name || 'Bàn -'}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                            Tổng tiền
                                                        </label>
                                                        <div className="mt-1 p-3 bg-emerald-50 rounded-lg text-emerald-900 font-bold text-xl">
                                                            {formatPrice(selectedInvoice.totalPrice)}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                            Ngày giờ đặt
                                                        </label>
                                                        <div className="mt-1 p-3 bg-slate-50 rounded-lg text-slate-900 font-medium text-sm">
                                                            {new Date(selectedInvoice.date).toLocaleString('vi-VN')}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                            Trạng thái
                                                        </label>
                                                        <select
                                                            value={selectedStatus}
                                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                                            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-slate-900"
                                                        >
                                                            <option value="pending">Đang chờ</option>
                                                            <option value="received">Đã tiếp nhận</option>
                                                            <option value="processing">Đã chế biến</option>
                                                            <option value="served">Đã phục vụ</option>
                                                            <option value="cancelled">Hủy</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Right Column - Items */}
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                        Chi tiết món ăn
                                                    </label>
                                                    <div className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-4 h-64 overflow-auto bg-slate-50">
                                                        {selectedInvoice.items && selectedInvoice.items.length ? (
                                                            <ol className="space-y-3 text-sm">
                                                                {selectedInvoice.items.map((it, i) => (
                                                                    <li
                                                                        key={i}
                                                                        className="flex justify-between items-start p-2 bg-white rounded border border-slate-200"
                                                                    >
                                                                        <span className="font-medium text-slate-900">
                                                                            {it.name}
                                                                        </span>
                                                                        <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs">
                                                                            x{it.quantity}
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ol>
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-slate-500">
                                                                Không có mục nào
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Summary */}
                                            <div className="border-t border-slate-200 pt-6">
                                                <div className="space-y-2 text-right text-sm">
                                                    <div className="flex justify-end gap-4">
                                                        <span className="text-slate-600">Subtotal:</span>
                                                        <span className="font-medium text-slate-900 min-w-30">
                                                            {formatPrice(selectedInvoice.itemsSubtotal)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-end gap-4">
                                                        <span className="text-slate-600">Thuế:</span>
                                                        <span className="font-medium text-slate-900 min-w-30">
                                                            {formatPrice(selectedInvoice.taxAmount)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-end gap-4">
                                                        <span className="text-slate-600">Phí phục vụ:</span>
                                                        <span className="font-medium text-slate-900 min-w-30">
                                                            {formatPrice(selectedInvoice.serviceCharge)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-end gap-4 text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                                                        <span>Tổng:</span>
                                                        <span className="min-w-30">
                                                            {formatPrice(selectedInvoice.totalPrice)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-end gap-4 text-sm text-slate-600 mt-2">
                                                        <span>Thanh toán:</span>
                                                        <span className="font-medium">
                                                            {selectedInvoice.paymentStatus}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer */}
                                {!detailLoading && selectedInvoice && (
                                    <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3">
                                        <button
                                            onClick={closeDetail}
                                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors duration-200"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const ids =
                                                        selectedInvoice.orderIds && selectedInvoice.orderIds.length
                                                            ? selectedInvoice.orderIds
                                                            : [];
                                                    if (ids.length === 0) return;
                                                    await updateOrdersStatus(ids, selectedStatus);
                                                    const res = await invoiceService.getAllInvoices();
                                                    const list = res?.data ?? res ?? [];
                                                    setOrders(Array.isArray(list) ? list : []);
                                                    closeDetail();
                                                } catch (err) {
                                                    console.error('Failed to update order status', err);
                                                }
                                            }}
                                            className="flex-1 px-4 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                                        >
                                            Xác nhận
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminOrders;
