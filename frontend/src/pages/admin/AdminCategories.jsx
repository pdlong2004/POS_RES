import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import AdminLoading from '@/components/admin/shared/AdminLoading';
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Loader2,
    X,
    RefreshCw,
    Layers,
    Check,
    Calendar,
    Zap,
    LayoutGrid,
    ArrowRight,
    ShieldCheck,
    Activity,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { getCategoryApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from '@/service/category.service';
import { cn } from '@/lib/utils';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', active: true });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await getCategoryApi();
            setCategories(res.data || []);
        } catch (error) {
            console.error('Fetch categories error', error);
            toast.error('Không thể truy xuất danh mục thực đơn');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setCurrentCategory(category);
            setFormData({ name: category.name, active: category.active });
        } else {
            setCurrentCategory(null);
            setFormData({ name: '', active: true });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) return toast.warning('Vui lòng nhập định danh danh mục');

        setIsSubmitting(true);
        try {
            if (currentCategory) {
                await updateCategoryApi(currentCategory._id, formData);
                toast.success('Đã cập nhật thực thể danh mục');
            } else {
                await createCategoryApi(formData);
                toast.success('Đã khởi tạo danh mục thực đơn mới');
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.error(currentCategory ? 'Cập nhật thất bại' : 'Khởi tạo thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await deleteCategoryApi(currentCategory._id);
            toast.success('Đã xóa vĩnh viễn danh mục');
            setIsDeleting(false);
            setCurrentCategory(null);
            fetchCategories();
        } catch (error) {
            toast.error('Xóa danh mục thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredCategories = categories.filter((c) => c.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <AdminLayout className="space-y-10">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        Phân loại thực đơn
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                        Quản lý cấu trúc danh mục, điều phối dòng chảy món ăn và tối ưu hóa trải nghiệm gọi món.
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <button
                        onClick={fetchCategories}
                        className="admin-btn-secondary w-12 h-12 flex items-center justify-center p-0"
                        title="Làm mới"
                    >
                        <RefreshCw size={18} className={cn(loading && 'animate-spin')} />
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex-1 lg:flex-none h-14 px-10 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-3"
                    >
                        <Plus size={20} /> Khởi tạo danh mục
                    </button>
                </div>
            </div>

            {/* ANALYTICS PREVIEW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                {[
                    {
                        label: 'Tổng số danh mục',
                        value: categories.length,
                        icon: Layers,
                        color: 'text-orange-600',
                        bg: 'bg-orange-50',
                    },
                    {
                        label: 'Đang hiển thị',
                        value: categories.filter((c) => c.active).length,
                        icon: Zap,
                        color: 'text-emerald-600',
                        bg: 'bg-emerald-50',
                    },
                    {
                        label: 'Danh mục ẩn',
                        value: categories.filter((c) => !c.active).length,
                        icon: Activity,
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
                                </p>
                            </div>
                            <div className={cn("w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500", stat.bg, stat.color)}>
                                <stat.icon size={28} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FILTER BAR */}
            <div className="admin-card p-8 border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm danh mục theo tên định danh..."
                        className="admin-input pl-14 h-16 bg-white/50 dark:bg-zinc-900/50 border-white dark:border-zinc-800 font-bold dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* DATA TABLE */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div className="admin-card overflow-hidden border-white/40 p-0 rounded-[2.5rem]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên danh mục</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày tạo</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <RefreshCw className="h-8 w-8 text-orange-600 animate-spin" />
                                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">
                                                    Đang truy xuất dữ liệu...
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-30">
                                                <LayoutGrid size={48} strokeWidth={1} />
                                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                                                    Không tìm thấy danh mục
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCategories.map((category) => (
                                        <tr key={category._id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                                                    #{category._id?.slice(-8).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                                        <Layers size={20} />
                                                    </div>
                                                    <span className="font-black text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors text-lg tracking-tight uppercase">
                                                        {category.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                {category.active ? (
                                                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-100">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-slate-50 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-zinc-700">
                                                        Hidden
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2.5 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest tabular-nums">
                                                    <Calendar size={14} className="text-orange-400/50" />
                                                    {category.createdAt ? new Date(category.createdAt).toLocaleDateString('vi-VN') : '—'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button
                                                        onClick={() => handleOpenModal(category)}
                                                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-orange-600 hover:bg-orange-50 border border-transparent hover:border-orange-100 rounded-xl transition-all"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setCurrentCategory(category);
                                                            setIsDeleting(true);
                                                        }}
                                                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* FORM MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white/95 backdrop-blur-xl w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                        <div className="p-10 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-100 dark:shadow-none">
                                    <Layers size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                        {currentCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
                                    </h2>
                                    <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                                        Category Management System
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-3 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                                    Tên danh mục <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative group">
                                    <LayoutGrid className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-400 group-focus-within:text-orange-600 transition-colors" />
                                    <input
                                        autoFocus
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Vd: Món Khai Vị, Signature, Cocktails..."
                                        className="admin-input pl-14 h-16 font-black text-xl tracking-tight uppercase dark:text-white dark:bg-zinc-900/50 dark:border-zinc-800"
                                    />
                                </div>
                            </div>

                            <div
                                className="flex items-center gap-6 p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] group cursor-pointer hover:border-orange-400/40 transition-all"
                                onClick={() => setFormData({ ...formData, active: !formData.active })}
                            >
                                <div
                                    className={cn(
                                        'w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 shrink-0 shadow-lg',
                                        formData.active
                                            ? 'bg-orange-600 border-orange-600 shadow-orange-100'
                                            : 'bg-white border-slate-200 shadow-sm',
                                    )}
                                >
                                    {formData.active && (
                                        <ShieldCheck size={28} className="text-white" strokeWidth={2.5} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                        Kích hoạt hiển thị
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                                        Cho phép danh mục xuất hiện trên menu khách hàng
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 bg-orange-50/50 rounded-[2.5rem] border border-orange-100 flex items-start gap-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 shadow-sm text-orange-600">
                                    <Zap size={24} />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-[11px] font-black text-orange-600 uppercase tracking-widest mb-2">
                                        System Architecture Note
                                    </p>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                        Định danh danh mục nên súc tích (tối đa 24 ký tự) để tối ưu hiển thị trên các thiết bị POS cầm tay.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 border-t border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 flex gap-6">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isSubmitting}
                                className="flex-1 py-5 rounded-2xl bg-white border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                            >
                                Hủy thao tác
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSubmitting}
                                className="flex-[1.5] py-5 rounded-2xl bg-orange-600 text-white text-xs font-black uppercase tracking-widest hover:bg-orange-700 shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <Check size={20} /> {currentCategory ? 'Lưu thay đổi' : 'Xác nhận khởi tạo'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {isDeleting && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-xl p-12 shadow-2xl text-center border border-white animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-rose-100 shadow-lg shadow-rose-50">
                            <Trash2 size={48} />
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">
                            Xóa danh mục?
                        </h3>
                        <p className="text-slate-500 mb-12 font-bold leading-relaxed max-w-md mx-auto">
                            Bạn đang thực hiện xóa thực thể{' '}
                            <span className="text-orange-600 font-black uppercase">"{currentCategory?.name}"</span>. Các món ăn thuộc danh mục này sẽ chuyển sang trạng thái "Chưa phân loại".
                        </p>
                        <div className="flex gap-6">
                            <button
                                onClick={() => setIsDeleting(false)}
                                disabled={isSubmitting}
                                className="flex-1 h-16 rounded-2xl bg-white border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                            >
                                Hủy thao tác
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isSubmitting}
                                className="flex-1 h-16 rounded-2xl bg-rose-600 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-100 transition-all flex items-center justify-center gap-2"
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

export default AdminCategories;


