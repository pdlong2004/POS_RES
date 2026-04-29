import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import AdminLoading from '@/components/admin/shared/AdminLoading';
import { getImportsApi, createImportApi, getImportDetailsApi } from '@/service/import.service';
import { getSuppliersApi } from '@/service/supplier.service';
import { getProductsApi } from '@/service/products.service';
import {
    Plus,
    Search,
    Loader2,
    Eye,
    FileBox,
    X,
    Check,
    XCircle,
    ArrowRight,
    RefreshCw,
    Truck,
    Calendar,
    DollarSign,
    ChevronRight,
    Package,
    Trash2,
    Zap,
    ArrowUpRight,
    TrendingUp,
    ShieldCheck,
    Box,
    Activity,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

const AdminImports = () => {
    const [imports, setImports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    // Data for dropdowns
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);

    // Create Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ supplierId: '', items: [] });
    // Item draft state for the form
    const [currentItem, setCurrentItem] = useState({ productId: '', quantity: 1, price: 0 });

    // Details Modal State
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedImport, setSelectedImport] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [impRes, supRes, prodRes] = await Promise.all([getImportsApi(), getSuppliersApi(), getProductsApi()]);

            setImports(impRes?.data || []);
            setSuppliers(supRes?.data || []);
            setProducts(prodRes?.data || []);
        } catch (err) {
            console.error('Failed to load data', err);
            toast.error('Không thể đồng bộ dữ liệu nhập kho');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openCreateModal = () => {
        setForm({ supplierId: '', items: [] });
        setCurrentItem({ productId: '', quantity: 1, price: 0 });
        setIsCreateModalOpen(true);
    };

    const handleAddItem = () => {
        if (!currentItem.productId || currentItem.quantity <= 0 || currentItem.price <= 0) {
            toast.warning('Vui lòng chọn sản phẩm và nhập tham số hợp lệ');
            return;
        }

        const existingIndex = form.items.findIndex((i) => i.productId === currentItem.productId);
        if (existingIndex >= 0) {
            const newItems = [...form.items];
            newItems[existingIndex].quantity += Number(currentItem.quantity);
            setForm((prev) => ({ ...prev, items: newItems }));
        } else {
            setForm((prev) => ({ ...prev, items: [...prev.items, { ...currentItem }] }));
        }
        setCurrentItem({ productId: '', quantity: 1, price: 0 });
    };

    const handleRemoveItem = (index) => {
        const newItems = form.items.filter((_, i) => i !== index);
        setForm((prev) => ({ ...prev, items: newItems }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!form.supplierId) return toast.warning('Vui lòng chọn đối tác cung ứng');
        if (form.items.length === 0) return toast.warning('Phiếu nhập chưa có danh mục hàng hóa');

        setIsSubmitting(true);
        try {
            await createImportApi(form);
            toast.success('Nhập hàng thành công! Đã tự động cộng ma trận tồn kho.');
            setIsCreateModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Submit failed', err);
            toast.error('Ghi nhận phiếu nhập thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDetailsModal = async (id) => {
        setIsDetailsModalOpen(true);
        setDetailsLoading(true);
        try {
            const res = await getImportDetailsApi(id);
            setSelectedImport(res.data);
        } catch (err) {
            console.error('Fail details', err);
            toast.error('Lỗi truy xuất dữ liệu chi tiết');
            setIsDetailsModalOpen(false);
        } finally {
            setDetailsLoading(false);
        }
    };

    const getProductName = (id) => products.find((p) => p._id === id)?.name || 'Unknown';
    const formTotal = form.items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity) || 0), 0);
    const filteredImports = imports.filter(
        (i) => i.supplierId?.name?.toLowerCase().includes(search.toLowerCase()) || i._id.includes(search),
    );

    return (
        <AdminLayout className="space-y-10">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Hệ thống nhập kho</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm italic">
                        Quản lý dòng chảy nguyên vật liệu, bổ sung tồn kho hệ thống.
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <button
                        onClick={fetchData}
                        className="admin-btn-secondary w-12 h-12 flex items-center justify-center p-0"
                        title="Làm mới"
                    >
                        <RefreshCw size={18} className={cn(loading && 'animate-spin')} />
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="flex-1 lg:flex-none h-14 px-10 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-3"
                    >
                        <Plus size={20} /> Khởi tạo phiếu nhập
                    </button>
                </div>
            </div>

            {/* ANALYTICS SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                {[
                    {
                        label: 'Giá trị nhập',
                        value: imports.reduce((s, i) => s + (i.totalPrice || 0), 0).toLocaleString('vi-VN'),
                        icon: TrendingUp,
                        color: 'text-orange-600',
                        bg: 'bg-orange-50',
                        suffix: 'đ',
                    },
                    {
                        label: 'Số lượng phiếu',
                        value: imports.length,
                        icon: FileBox,
                        color: 'text-amber-600',
                        bg: 'bg-amber-50',
                    },
                    { 
                        label: 'Nhà cung cấp', 
                        value: suppliers.length, 
                        icon: Truck, 
                        color: 'text-sky-600',
                        bg: 'bg-sky-50'
                    },
                    {
                        label: 'Sản phẩm quản lý',
                        value: products.length,
                        icon: Box,
                        color: 'text-rose-600',
                        bg: 'bg-rose-50',
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="admin-card p-8 group hover:border-orange-400/40 transition-all duration-500"
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                                    {stat.value}
                                    <span className="text-xs ml-1 opacity-40 font-bold">{stat.suffix}</span>
                                </p>
                            </div>
                            <div className={cn("w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500", stat.bg, stat.color, "dark:bg-zinc-800 dark:shadow-none")}>
                                <stat.icon size={28} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* SEARCH BAR */}
            <div className="admin-card p-8 border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm phiếu nhập theo UID hoặc tên đối tác cung ứng..."
                        className="admin-input pl-14 h-16 bg-white/50 dark:bg-zinc-900/50 border-white dark:border-zinc-800 font-bold dark:text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* DATA TABLE */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                {loading ? (
                    <div className="admin-card py-32 flex flex-col items-center justify-center border-white/40 rounded-[2.5rem]">
                        <RefreshCw className="h-10 w-10 text-orange-600 animate-spin" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-6 animate-pulse">
                            Đang ánh xạ lịch sử vận hành kho...
                        </p>
                    </div>
                ) : filteredImports.length === 0 ? (
                    <div className="admin-card py-32 flex flex-col items-center justify-center border-white/40 rounded-[2.5rem]">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                            <FileBox size={48} strokeWidth={1} />
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Hồ sơ nhập kho trống</p>
                    </div>
                ) : (
                    <div className="admin-card overflow-hidden border-white/40 p-0 rounded-[2.5rem]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Định danh UID</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Đối tác chiến lược</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Thời gian</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Tổng định mức (VND)</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                                    {filteredImports.map((imp) => (
                                        <tr key={imp._id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-md border border-slate-200 dark:border-zinc-700 group-hover:text-orange-600 group-hover:border-orange-100 dark:group-hover:border-orange-900 transition-all">
                                                    #{imp._id.slice(-8).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 flex items-center justify-center text-orange-600 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                                        <Truck size={18} />
                                                    </div>
                                                    <span className="font-black text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors text-sm tracking-tight uppercase">
                                                        {imp.supplierId?.name || 'VÃNG LAI'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest tabular-nums">
                                                    <Calendar size={14} className="text-orange-400" />
                                                    {new Date(imp.createdAt).toLocaleString('vi-VN')}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-lg font-black text-emerald-600 tabular-nums tracking-tighter">
                                                    {imp.totalPrice?.toLocaleString('vi-VN')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => openDetailsModal(imp._id)}
                                                    className="inline-flex items-center gap-3 px-6 py-2.5 bg-white dark:bg-zinc-800 hover:bg-orange-600 text-slate-500 dark:text-slate-400 hover:text-white rounded-xl border border-slate-200 dark:border-zinc-700 hover:border-orange-600 transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em] group/btn shadow-sm"
                                                >
                                                    <Eye size={14} className="group-hover/btn:scale-110 transition-transform" />
                                                    Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* CREATE MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white/95 backdrop-blur-xl w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden border border-white animate-in zoom-in-95 duration-500 flex flex-col h-[90vh]">
                        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white/50">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-100">
                                    <TrendingUp size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                                        Khởi tạo phiếu nhập kho
                                    </h2>
                                    <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                                        Inventory Matrix Synchronization
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-3 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                            {/* LEFT: FORM INPUT */}
                            <div className="w-full lg:w-5/12 p-10 border-r border-slate-100 overflow-y-auto scrollbar-hide space-y-10 bg-slate-50/50">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                                        Đối tác cung ứng chiến lược <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <Truck className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-400 group-focus-within:text-orange-600 transition-colors" />
                                        <select
                                            value={form.supplierId}
                                            onChange={(e) => setForm((f) => ({ ...f, supplierId: e.target.value }))}
                                            className="admin-input pl-14 h-16 font-black text-sm uppercase tracking-widest appearance-none bg-white"
                                        >
                                            <option value="">-- LỰA CHỌN ĐỐI TÁC --</option>
                                            {suppliers.map((s) => (
                                                <option key={s._id} value={s._id}>
                                                    {s.name.toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={16} />
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 space-y-8 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                            <Plus size={20} />
                                        </div>
                                        <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                                            Cấu hình danh mục hàng
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mặt hàng định danh</label>
                                        <select
                                            value={currentItem.productId}
                                            onChange={(e) => setCurrentItem((prev) => ({ ...prev, productId: e.target.value }))}
                                            className="admin-input h-14 bg-slate-50 text-[11px] font-black uppercase tracking-widest px-4 appearance-none"
                                        >
                                            <option value="">-- LỰA CHỌN SẢN PHẨM --</option>
                                            {products.map((p) => (
                                                <option key={p._id} value={p._id}>
                                                    {p.name.toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Định lượng (Pax)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={currentItem.quantity}
                                                onChange={(e) => setCurrentItem((prev) => ({ ...prev, quantity: e.target.value }))}
                                                className="admin-input h-14 bg-slate-50 font-black text-xl tabular-nums text-center"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Đơn giá nhập</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={currentItem.price}
                                                onChange={(e) => setCurrentItem((prev) => ({ ...prev, price: e.target.value }))}
                                                className="admin-input h-14 bg-slate-50 font-black text-xl tabular-nums text-center"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="w-full h-16 bg-orange-600 text-white hover:bg-orange-700 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 shadow-xl shadow-orange-100 active:scale-95"
                                    >
                                        Ghi nhận vào danh sách
                                    </button>
                                </div>

                                <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
                                    <Activity className="text-amber-600 shrink-0 mt-1" size={18} />
                                    <p className="text-[11px] text-amber-800 leading-relaxed font-bold">
                                        Hệ thống sẽ tự động cập nhật trung bình giá vốn và tăng số lượng tồn kho khả dụng ngay sau khi xác nhận.
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT: ITEMS REVIEW */}
                            <div className="flex-1 p-10 overflow-y-auto scrollbar-hide flex flex-col bg-white">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                        <Box size={20} className="text-orange-600" /> Bản kê khai hàng nhập
                                    </h3>
                                    <div className="flex items-center gap-4 px-8 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <DollarSign size={20} />
                                        </div>
                                        <span className="text-3xl font-black text-emerald-600 tabular-nums tracking-tighter">
                                            {formTotal.toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    {form.items.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-200 space-y-6">
                                            <Package size={80} strokeWidth={1} />
                                            <div className="text-center space-y-2">
                                                <p className="text-sm font-black uppercase tracking-widest text-slate-400">Danh mục hàng hóa trống</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Bắt đầu thêm sản phẩm từ bảng cấu hình bên trái</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                            {form.items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="admin-card p-6 bg-slate-50 border-slate-100 hover:border-orange-400/40 transition-all group flex items-center justify-between animate-in slide-in-from-right duration-300"
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-black text-xs group-hover:text-orange-600 group-hover:border-orange-100 transition-all shadow-sm">
                                                            {String(index + 1).padStart(2, '0')}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight text-base">
                                                                {getProductName(item.productId)}
                                                            </p>
                                                            <div className="flex items-center gap-3 mt-1.5">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-slate-100">
                                                                    {item.quantity} units
                                                                </span>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                                                    @ {Number(item.price).toLocaleString('vi-VN')}đ
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-8">
                                                        <span className="text-xl font-black text-emerald-600 tabular-nums tracking-tighter">
                                                            {(item.quantity * item.price).toLocaleString('vi-VN')}
                                                        </span>
                                                        <button
                                                            onClick={() => handleRemoveItem(index)}
                                                            className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-10 border-t border-slate-100 bg-white/50 flex gap-6">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                disabled={isSubmitting}
                                className="flex-1 py-5 rounded-2xl bg-white border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                            >
                                Hủy thao tác
                            </button>
                            <button
                                onClick={handleCreateSubmit}
                                disabled={isSubmitting}
                                className="flex-[2] py-5 rounded-2xl bg-orange-600 text-white text-xs font-black uppercase tracking-widest hover:bg-orange-700 shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <ShieldCheck size={20} /> Xác thực nhập kho & Cập nhật ma trận tồn kho
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DETAILS MODAL */}
            {isDetailsModalOpen && selectedImport && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white/95 backdrop-blur-xl w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white/50">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-[2rem] bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-100">
                                    <FileBox size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                                        Phiếu #{selectedImport.import._id.slice(-8).toUpperCase()}
                                    </h2>
                                    <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                                        Forensic Supply Chain Records
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsDetailsModalOpen(false)} className="p-3 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        {detailsLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-32">
                                <RefreshCw className="w-12 h-12 text-orange-600 animate-spin" />
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                                {/* SUMMARY BLOCK */}
                                <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 space-y-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full -mr-24 -mt-24 blur-3xl" />
                                    
                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đơn vị cung ứng</p>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                                                {selectedImport.import.supplierId?.name || 'VÃNG LAI'}
                                            </h3>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời điểm xác thực</p>
                                            <p className="text-base font-black text-slate-900 tabular-nums tracking-widest">
                                                {new Date(selectedImport.import.createdAt).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-slate-200 flex justify-between items-center">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Giá trị quyết toán</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authenticated & Stocked</span>
                                            </div>
                                        </div>
                                        <span className="text-5xl font-black text-emerald-600 tabular-nums tracking-tighter">
                                            {selectedImport.import.totalPrice?.toLocaleString('vi-VN')}
                                            <span className="text-lg ml-1 uppercase opacity-30 font-bold">vnd</span>
                                        </span>
                                    </div>
                                </div>

                                {/* ITEMS LIST */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                            <Package size={16} className="text-orange-600" /> Phân tách chi tiết lô hàng
                                        </h4>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                            {selectedImport.details?.length || 0} SKU
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {selectedImport.details?.map((d) => (
                                            <div
                                                key={d._id}
                                                className="admin-card p-5 bg-white border-slate-100 hover:border-orange-400/20 transition-all flex items-center gap-6 group"
                                            >
                                                <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                                                    <img
                                                        src={d.productId?.image || 'https://placehold.co/200'}
                                                        alt=""
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-lg font-black text-slate-900 truncate uppercase tracking-tight group-hover:text-orange-600 transition-colors">
                                                        {d.productId?.name}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                            <Box size={10} /> {d.quantity} units
                                                        </div>
                                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                            <DollarSign size={10} /> {d.price.toLocaleString('vi-VN')}đ / unit
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-xl font-black text-emerald-600 tabular-nums tracking-tighter">
                                                        {(d.quantity * d.price).toLocaleString('vi-VN')}đ
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-10 border-t border-slate-100 bg-white/50">
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="w-full py-5 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                            >
                                Hoàn tất truy xuất
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminImports;


