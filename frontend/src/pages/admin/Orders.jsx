import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import AdminLoading from '@/components/admin/shared/AdminLoading';
import invoiceService from '@/service/invoiceApi.service';
import { getOrderById, updateOrdersStatus } from '@/service/order.service';
import {
    Search,
    Calendar,
    Filter,
    Loader2,
    Eye,
    X,
    TrendingUp,
    Receipt,
    Clock,
    CheckCircle2,
    AlertCircle,
    FileText,
    CreditCard,
    QrCode,
    Wallet,
    Banknote,
    Printer,
    ChevronRight,
    ArrowUpRight,
    RefreshCw,
    DollarSign,
    Package,
    User,
    ArrowRight,
    ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import Pagination from '@/components/admin/shared/Pagination';

const AdminOrders = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const res = await invoiceService.getAllInvoices();
            const list = res?.data ?? res ?? [];
            setOrders(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error('Failed to load orders', err);
            setOrders([]);
            toast.error('Không thể tải danh sách hóa đơn');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
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

    // Statistics calculations
    const stats = useMemo(() => {
        const totalRevenue = filtered.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
        const pendingCount = filtered.filter((o) => o.paymentStatus === 'pending').length;
        const paidCount = filtered.filter((o) => o.paymentStatus === 'paid').length;
        const todayCount = filtered.filter((o) => {
            const today = new Date().toLocaleDateString();
            return new Date(o.createdAt).toLocaleDateString() === today;
        }).length;

        return { totalRevenue, pendingCount, paidCount, todayCount, totalInvoices: filtered.length };
    }, [filtered]);

    const formatPrice = (p) => `${Number(p || 0).toLocaleString('vi-VN')}đ`;

    // Pagination logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedOrders = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, from, to]);

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
        if (!status) return 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-zinc-700';
        const s = status.toLowerCase();
        if (s.includes('pending') || s.includes('chờ')) return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
        if (s.includes('received') || s.includes('tiếp')) return 'bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-900/30';
        if (s.includes('processing') || s.includes('chế')) return 'bg-purple-50 dark:bg-purple-950/20 text-amber-600 dark:text-amber-400 border-purple-100 dark:border-purple-900/30';
        if (s.includes('served') || s.includes('phục')) return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
        if (s.includes('cancelled') || s.includes('hủy')) return 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
        if (s.includes('paid')) return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
        return 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-zinc-700';
    };

    const getPaymentIcon = (method) => {
        const m = method?.toLowerCase();
        if (m === 'bank') return <CreditCard size={16} className="text-sky-600" />;
        if (m === 'qr') return <QrCode size={16} className="text-amber-600" />;
        if (m === 'vnpay') return <Wallet size={16} className="text-red-600" />;
        if (m === 'cash') return <Banknote size={16} className="text-emerald-600" />;
        return <AlertCircle size={16} className="text-slate-400" />;
    };

    return (
        <AdminLayout className="space-y-10">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Hóa đơn</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                        Hệ thống trích xuất và quản lý dòng tiền vận hành nhà hàng.
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <button
                        onClick={fetchInvoices}
                        className="admin-btn-secondary w-12 h-12 flex items-center justify-center p-0 dark:bg-zinc-900/50 dark:border-zinc-800"
                        title="Làm mới"
                    >
                        <RefreshCw size={18} className={cn(loading && 'animate-spin')} />
                    </button>
                    <div className="flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-6 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                        Live Monitoring
                    </div>
                </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                {[
                    {
                        label: 'Doanh thu',
                        value: formatPrice(stats.totalRevenue),
                        icon: TrendingUp,
                        color: 'text-orange-600',
                        bg: 'bg-orange-50',
                    },
                    {
                        label: 'Tổng đơn',
                        value: stats.totalInvoices,
                        icon: FileText,
                        color: 'text-sky-600',
                        bg: 'bg-sky-50',
                    },
                    {
                        label: 'Chờ TT',
                        value: stats.pendingCount,
                        icon: Clock,
                        color: 'text-amber-600',
                        bg: 'bg-amber-50',
                    },
                    {
                        label: 'Hôm nay',
                        value: stats.todayCount,
                        icon: CheckCircle2,
                        color: 'text-emerald-600',
                        bg: 'bg-emerald-50',
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="admin-card p-8 group hover:border-orange-400/40 dark:hover:border-orange-500/40 transition-all duration-500 bg-white/50 dark:bg-zinc-900/50"
                    >
                        <div className="flex items-center gap-6">
                            <div className={cn("w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-lg dark:shadow-none group-hover:scale-110 transition-transform duration-500", stat.bg, stat.color, "dark:bg-opacity-20")}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FILTER BAR */}
            <div className="admin-card p-8 border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm kiếm hóa đơn theo mã hoặc bàn..."
                            className="admin-input pl-14 h-14 bg-white/50 dark:bg-zinc-900/50 border-white dark:border-zinc-800 font-bold text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">Từ ngày</span>
                            <input
                                type="date"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="admin-input h-14 px-6 font-black bg-white/50 dark:bg-zinc-900/50 border-white dark:border-zinc-800 flex-1 sm:w-48 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">Đến ngày</span>
                            <input
                                type="date"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="admin-input h-14 px-6 font-black bg-white/50 dark:bg-zinc-900/50 border-white dark:border-zinc-800 flex-1 sm:w-48 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* DATA TABLE */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div className="admin-card overflow-hidden border-white/40 p-0 rounded-[2.5rem]">
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mã HD</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Bàn / Vị trí</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Thời gian</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Thanh toán</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Phục vụ</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Tổng cộng</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <RefreshCw className="h-8 w-8 text-orange-600 animate-spin" />
                                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">
                                                    Đang truy xuất dữ liệu...
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-slate-200 dark:text-zinc-700">
                                                    <Receipt size={40} strokeWidth={1} />
                                                </div>
                                                <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">Không tìm thấy hóa đơn</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedOrders.map((o) => (
                                        <tr key={o._id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                                                    #{o._id.slice(-8).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-center text-orange-600 shadow-sm">
                                                        <Receipt size={18} />
                                                    </div>
                                                    <span className="font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors uppercase tracking-tight">
                                                        {o.table?.name || 'Vãng lai'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                                                    <Clock size={14} className="text-slate-300 dark:text-slate-600" />
                                                    {new Date(o.createdAt).toLocaleString('vi-VN')}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={cn('px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border', getStatusBadge(o.paymentStatus))}>
                                                    {o.paymentStatus === 'paid' ? 'Đã thu tiền' : 'Chờ TT'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={cn('px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border', getStatusBadge(o.status))}>
                                                    {o.status || 'Khởi tạo'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-base font-black text-slate-900 dark:text-white tabular-nums">
                                                    {formatPrice(o.totalPrice || o.itemsSubtotal || 0)}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => openDetail(o._id)}
                                                    className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 border border-transparent hover:border-orange-100 dark:hover:border-orange-900/30 rounded-xl transition-all"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filtered.length}
                        itemsPerPage={itemsPerPage}
                        className="bg-white/30"
                    />
                </div>
            </div>

            {/* DETAIL MODAL */}
            {detailOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white dark:border-zinc-800 animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                        <div className="p-10 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-800/50">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-100 dark:shadow-none">
                                    <Receipt size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                        Chi tiết hóa đơn #{selectedInvoice?._id?.slice(-8).toUpperCase() || '---'}
                                    </h2>
                                    <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Transaction Information</p>
                                </div>
                            </div>
                            <button onClick={closeDetail} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                                <X size={20} className="text-slate-400 dark:text-slate-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                            {detailLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                                </div>
                            ) : selectedInvoice && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-6 bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Bàn / Vị trí</p>
                                            <p className="text-lg font-black text-slate-900 dark:text-white uppercase">{selectedInvoice.table?.name || 'Vãng lai'}</p>
                                        </div>
                                        <div className="p-6 bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Thanh toán</p>
                                            <div className="flex flex-col gap-2">
                                                <span className={cn('px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit', getStatusBadge(selectedInvoice.paymentStatus))}>
                                                    {selectedInvoice.paymentStatus}
                                                </span>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest italic">
                                                    {getPaymentIcon(selectedInvoice.paymentMethod)}
                                                    {selectedInvoice.paymentMethod || 'Tiền mặt'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl space-y-4">
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tiến độ xử lý</p>
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 outline-none text-slate-900 dark:text-white"
                                            >
                                                <option value="pending" className="dark:bg-zinc-900">Đang chờ</option>
                                                <option value="received" className="dark:bg-zinc-900">Đã tiếp nhận</option>
                                                <option value="processing" className="dark:bg-zinc-900">Đã chế biến</option>
                                                <option value="served" className="dark:bg-zinc-900">Đã phục vụ</option>
                                                <option value="cancelled" className="dark:bg-zinc-900">Hủy đơn</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Chi tiết thực đơn</h4>
                                        <div className="border border-slate-100 dark:border-zinc-800 rounded-[2rem] overflow-hidden">
                                            <table className="w-full text-left">
                                                <thead className="bg-slate-50 dark:bg-zinc-800 border-b border-slate-100 dark:border-zinc-700">
                                                    <tr>
                                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Món ăn</th>
                                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">SL</th>
                                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Đơn giá</th>
                                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Thành tiền</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                                                    {selectedInvoice.items?.map((it, i) => (
                                                        <tr key={i}>
                                                            <td className="px-6 py-4">
                                                                <span className="font-bold text-slate-900 dark:text-white text-xs uppercase">{it.name}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400">x{it.quantity}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 dark:text-slate-500 tabular-nums">
                                                                {formatPrice(it.price)}
                                                            </td>
                                                            <td className="px-6 py-4 text-right font-black text-slate-900 dark:text-white text-xs tabular-nums">
                                                                {formatPrice(it.price * it.quantity)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                                        <div className="relative z-10 space-y-6">
                                            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                                <span>Tổng tạm tính</span>
                                                <span className="text-white">{formatPrice(selectedInvoice.itemsSubtotal)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                                <span>Thuế & Phí</span>
                                                <span className="text-white">{formatPrice((selectedInvoice.taxAmount || 0) + (selectedInvoice.serviceCharge || 0))}</span>
                                            </div>
                                            <div className="h-px bg-white/10" />
                                            <div className="flex justify-between items-end">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">Final Amount</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Bao gồm VAT và phí phục vụ</p>
                                                </div>
                                                <p className="text-5xl font-black text-white tracking-tighter tabular-nums italic">
                                                    {formatPrice(selectedInvoice.totalPrice)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-10 border-t border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-800/50 flex gap-6 shrink-0">
                            <button
                                onClick={closeDetail}
                                className="px-8 py-5 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const ids = selectedInvoice.orderIds || [];
                                        if (ids.length === 0) return;
                                        await updateOrdersStatus(ids, selectedStatus);
                                        toast.success('Đã cập nhật trạng thái phục vụ');
                                        fetchInvoices();
                                        closeDetail();
                                    } catch (err) {
                                        toast.error('Cập nhật trạng thái thất bại');
                                    }
                                }}
                                className="flex-1 py-5 rounded-2xl bg-orange-600 text-white text-xs font-black uppercase tracking-widest hover:bg-orange-700 shadow-xl shadow-orange-100 dark:shadow-none transition-all flex items-center justify-center gap-3"
                            >
                                <CheckCircle2 size={18} /> Cập nhật phục vụ
                            </button>
                            <button className="w-16 h-16 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-500 hover:border-orange-100 dark:hover:border-orange-900 transition-all shadow-sm">
                                <Printer size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminOrders;
