import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import AdminLoading from '@/components/admin/shared/AdminLoading';
import { getSuppliersApi, createSupplierApi, updateSupplierApi, deleteSupplierApi } from '@/service/supplier.service';
import {
    Plus,
    Search,
    Loader2,
    Edit2,
    Trash2,
    X,
    Truck,
    RefreshCw,
    Mail,
    Phone,
    MapPin,
    CheckCircle2,
    ShieldCheck,
    Briefcase,
    Zap,
    AlertTriangle,
    Building2,
    User,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

const AdminSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [form, setForm] = useState({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        taxCode: '',
        status: true,
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getSuppliersApi();
            setSuppliers(res?.data || res || []);
        } catch (err) {
            console.error('Failed to load data', err);
            toast.error('Không thể tải dữ liệu mạng lưới cung ứng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openCreateModal = () => {
        setEditingSupplier(null);
        setForm({
            name: '',
            contactPerson: '',
            phone: '',
            email: '',
            address: '',
            taxCode: '',
            status: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (supplier) => {
        setEditingSupplier(supplier);
        setForm({
            name: supplier.name || '',
            contactPerson: supplier.contactPerson || '',
            phone: supplier.phone || '',
            email: supplier.email || '',
            address: supplier.address || '',
            taxCode: supplier.taxCode || '',
            status: supplier.status !== undefined ? supplier.status : true,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSupplier(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return toast.warning('Vui lòng nhập định danh nhà cung cấp');

        setIsSubmitting(true);
        try {
            if (editingSupplier) {
                await updateSupplierApi(editingSupplier._id, form);
                toast.success('Đã cập nhật hồ sơ đối tác');
            } else {
                await createSupplierApi(form);
                toast.success('Đã khởi tạo đối tác cung ứng mới');
            }
            closeModal();
            fetchData();
        } catch (err) {
            console.error('Submit failed', err);
            toast.error(editingSupplier ? 'Cập nhật thất bại' : 'Khởi tạo thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDeleteConfirm = (id) => {
        setDeletingId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        setIsSubmitting(true);
        try {
            await deleteSupplierApi(deletingId);
            toast.success('Đã xóa hồ sơ nhà cung cấp');
            setIsDeleteModalOpen(false);
            setDeletingId(null);
            fetchData();
        } catch (err) {
            console.error('Delete failed', err);
            toast.error('Xóa hồ sơ thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredSuppliers = suppliers.filter(
        (s) => s.name?.toLowerCase().includes(search.toLowerCase()) || s.phone?.includes(search),
    );

    return (
        <AdminLayout className="space-y-10">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Đối tác cung ứng</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                        Quản lý mạng lưới đối tác chiến lược và chuỗi cung ứng tổng thể.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <button
                        onClick={fetchData}
                        className="admin-btn-secondary w-12 h-12 flex items-center justify-center p-0 dark:bg-zinc-900/50 dark:border-zinc-800"
                        title="Làm mới"
                    >
                        <RefreshCw size={18} className={cn(loading && 'animate-spin')} />
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="flex-1 lg:flex-none h-14 px-10 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 dark:shadow-none transition-all flex items-center justify-center gap-3"
                    >
                        <Plus size={20} /> Khởi tạo đối tác
                    </button>
                </div>
            </div>

            {/* ANALYTICS PREVIEW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                {[
                    {
                        label: 'Tổng đối tác',
                        value: suppliers.length,
                        icon: Building2,
                        color: 'text-orange-600 dark:text-orange-400',
                        bg: 'bg-orange-50 dark:bg-orange-950/20',
                    },
                    {
                        label: 'Đang hoạt động',
                        value: suppliers.filter((s) => s.status).length,
                        icon: ShieldCheck,
                        color: 'text-emerald-600 dark:text-emerald-400',
                        bg: 'bg-emerald-50 dark:bg-emerald-950/20',
                    },
                    {
                        label: 'Tạm ngưng',
                        value: suppliers.filter((s) => !s.status).length,
                        icon: AlertTriangle,
                        color: 'text-rose-600 dark:text-rose-400',
                        bg: 'bg-rose-50 dark:bg-rose-950/20',
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="admin-card p-8 group hover:border-orange-400/40 transition-all duration-500 bg-white dark:bg-zinc-900 border-white/20 dark:border-zinc-800/50"
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={cn("w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500", stat.bg, stat.color)}>
                                <stat.icon size={28} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* SEARCH BAR */}
            <div className="admin-card p-8 border-white/20 dark:border-zinc-800/50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 bg-white/50 dark:bg-zinc-900/50">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-orange-600 dark:group-focus-within:text-orange-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm đối tác theo tên doanh nghiệp, mã số thuế hoặc số điện thoại..."
                        className="admin-input pl-14 h-16 bg-white/50 dark:bg-zinc-900 border-white dark:border-zinc-800 font-bold text-slate-900 dark:text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* DATA TABLE */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                {loading ? (
                    <div className="admin-card py-32 flex flex-col items-center justify-center border-white/40 dark:border-zinc-800/50 rounded-[2.5rem] bg-white/30 dark:bg-zinc-900/30">
                        <RefreshCw className="h-10 w-10 text-orange-600 animate-spin" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-6 animate-pulse">
                            Đang ánh xạ mạng lưới cung ứng...
                        </p>
                    </div>
                ) : filteredSuppliers.length === 0 ? (
                    <div className="admin-card py-32 flex flex-col items-center justify-center border-white/40 dark:border-zinc-800/50 rounded-[2.5rem] bg-white/30 dark:bg-zinc-900/30">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                            <Truck size={48} strokeWidth={1} />
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Không tìm thấy đối tác</p>
                    </div>
                ) : (
                    <div className="admin-card overflow-hidden border-white/40 dark:border-zinc-800/50 p-0 rounded-[2.5rem] bg-white/50 dark:bg-zinc-900/50">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50">
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Doanh nghiệp</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Đại diện pháp lý</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Trạng thái</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                                    {filteredSuppliers.map((s) => (
                                        <tr key={s._id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm text-orange-600 dark:text-orange-500">
                                                        <Truck size={24} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors truncate text-base tracking-tight uppercase">
                                                            {s.name}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-1.5">
                                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                                <Zap size={10} className="text-amber-500" />
                                                                MST: {s.taxCode || '---'}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate max-w-[150px]">
                                                                <Mail size={10} className="text-orange-400" />
                                                                {s.email || '-'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <User size={12} className="text-slate-400" />
                                                        <p className="text-sm font-black text-slate-700 dark:text-slate-300 tracking-tight">
                                                            {s.contactPerson || 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-black tabular-nums tracking-widest">
                                                        <Phone size={12} className="text-orange-400" />
                                                        {s.phone || '-'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                {s.status ? (
                                                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-100">
                                                        Reliable
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-rose-50 text-rose-600 border-rose-100">
                                                        Suspended
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button
                                                        onClick={() => openEditModal(s)}
                                                        className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-zinc-800 border border-transparent hover:border-orange-100 dark:hover:border-orange-900 rounded-xl transition-all"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteConfirm(s._id)}
                                                        className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-zinc-800 border border-transparent hover:border-rose-100 dark:hover:border-rose-900 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* FORM MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white dark:border-zinc-800 animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                        <div className="p-10 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-800/50">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-100">
                                    <Building2 size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                        {editingSupplier ? 'Cập nhật đối tác' : 'Thêm nhà cung cấp'}
                                    </h2>
                                    <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                                        Supplier Management System
                                    </p>
                                </div>
                            </div>
                            <button onClick={closeModal} className="p-3 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide bg-white/50 dark:bg-zinc-900/50">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                                    Tên doanh nghiệp / Nhà cung cấp <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative group">
                                    <Truck className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-400 group-focus-within:text-orange-600 transition-colors" />
                                    <input
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                        placeholder="Vd: Công ty Cổ phần Thực phẩm Sạch..."
                                        className="admin-input pl-14 h-16 font-black text-xl tracking-tight bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Người đại diện</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                                        <input
                                            value={form.contactPerson}
                                            onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))}
                                            className="admin-input pl-14 h-14 font-bold bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                                            placeholder="Họ và tên..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Mã số thuế</label>
                                    <div className="relative group">
                                        <Zap className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                                        <input
                                            value={form.taxCode}
                                            onChange={(e) => setForm((f) => ({ ...f, taxCode: e.target.value }))}
                                            className="admin-input pl-14 h-14 font-bold tabular-nums bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                                            placeholder="010xxxxxxx..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Hotline</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                                        <input
                                            value={form.phone}
                                            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                                            className="admin-input pl-14 h-14 font-bold tabular-nums bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                                            placeholder="09xx xxx xxx..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                            className="admin-input pl-14 h-14 font-bold bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                                            placeholder="contact@supplier.com..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Địa chỉ trụ sở</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-5 top-5 w-5 h-5 text-orange-400" />
                                    <textarea
                                        value={form.address}
                                        onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                                        rows={3}
                                        className="admin-input pl-14 p-5 bg-white dark:bg-zinc-900 border-white dark:border-zinc-800 resize-none font-bold h-32 text-slate-900 dark:text-white"
                                        placeholder="Nhập địa chỉ chi tiết..."
                                    />
                                </div>
                            </div>

                            <div
                                className="flex items-center gap-6 p-8 bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] group cursor-pointer hover:border-orange-400/40 transition-all"
                                onClick={() => setForm((f) => ({ ...f, status: !f.status }))}
                            >
                                <div
                                    className={cn(
                                        'w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 shrink-0 shadow-lg dark:shadow-none',
                                        form.status
                                            ? 'bg-orange-600 border-orange-600 shadow-orange-100 dark:shadow-none'
                                            : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm',
                                    )}
                                >
                                    {form.status && <ShieldCheck size={28} className="text-white" strokeWidth={2.5} />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Kích hoạt quan hệ đối tác</p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Cho phép khởi tạo các giao dịch nhập hàng</p>
                                </div>
                            </div>
                        </form>

                        <div className="p-10 border-t border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-800/50 flex gap-6">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={isSubmitting}
                                className="flex-1 py-5 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 py-5 rounded-2xl bg-orange-600 text-white text-xs font-black uppercase tracking-widest hover:bg-orange-700 shadow-xl shadow-orange-100 dark:shadow-none transition-all flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : editingSupplier ? 'Lưu hồ sơ đối tác' : 'Xác nhận khởi tạo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-w-xl p-12 shadow-2xl text-center border border-white dark:border-zinc-800 animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-rose-100 dark:border-rose-900/30 shadow-lg shadow-rose-50 dark:shadow-none">
                            <Trash2 size={48} />
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">Chấm dứt hợp tác?</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-12 font-bold leading-relaxed max-w-md mx-auto">
                            Hành động này sẽ xóa vĩnh viễn hồ sơ đối tác khỏi danh mục hiện hành. Dữ liệu lịch sử sẽ được lưu trữ để phục vụ kiểm toán.
                        </p>
                        <div className="flex gap-6">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isSubmitting}
                                className="flex-1 h-16 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all"
                            >
                                Hủy thao tác
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isSubmitting}
                                className="flex-1 h-16 rounded-2xl bg-rose-600 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-100 dark:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Xác nhận xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminSuppliers;


