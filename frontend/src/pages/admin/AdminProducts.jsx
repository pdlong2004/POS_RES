import React, { useState, useMemo, useEffect } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import AdminLoading from '@/components/admin/shared/AdminLoading';
import {
    Plus,
    Search,
    Loader2,
    Edit2,
    Trash2,
    X,
    Check,
    Image as ImageIcon,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Filter,
    MoreHorizontal,
    Zap,
} from 'lucide-react';
import { getProductsApi, createProductApi, updateProductApi, deleteProductApi } from '@/service/products.service';
import { getCategoryApi } from '@/service/category.service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';
import Pagination from '@/components/admin/shared/Pagination';

// ========================
// 2. OPTIMIZED COMPONENTS
// ========================

const ProductFilter = React.memo(({
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    categories,
}) => {
    return (
        <div className="admin-card p-6 flex flex-col md:flex-row items-center gap-6 border-white/20 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50">
            <div className="relative flex-1 w-full group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-600 group-focus-within:text-orange-600 dark:group-focus-within:text-orange-500 transition-colors" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm món ăn, danh mục..."
                    className="admin-input h-14 pl-12 bg-white/50 dark:bg-zinc-900/50 border-white dark:border-zinc-800 text-slate-900 dark:text-white"
                />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="admin-input appearance-none pl-6 pr-12 h-14 bg-white/50 dark:bg-zinc-900/50 border-white dark:border-zinc-800 text-slate-900 dark:text-white cursor-pointer font-bold text-xs uppercase tracking-widest"
                    >
                        <option value="All" className="dark:bg-zinc-900">Tất cả danh mục</option>
                        {categories.map((c) => (
                            <option key={c._id} value={c._id} className="dark:bg-zinc-900">
                                {c.name}
                            </option>
                        ))}
                    </select>
                    <Filter className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <div className="relative flex-1 md:w-56">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="admin-input appearance-none pl-6 pr-12 h-14 bg-white/50 dark:bg-zinc-900/50 border-white dark:border-zinc-800 text-slate-900 dark:text-white cursor-pointer font-bold text-xs uppercase tracking-widest"
                    >
                        <option value="All" className="dark:bg-zinc-900">Trạng thái</option>
                        <option value="Active" className="dark:bg-zinc-900">Còn hàng</option>
                        <option value="Out of stock" className="dark:bg-zinc-900">Hết hàng</option>
                    </select>
                    <Filter className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>
    );
});

const ProductRow = React.memo(({ p, selectedIds, onSelect, onEdit, onDelete, formatPrice }) => {
    const status = p.stock_quantity > 0 ? 'Active' : 'Out of stock';
    return (
        <tr className="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
            <td className="px-8 py-6 text-center">
                <label className="flex items-center cursor-pointer justify-center">
                    <input
                        type="checkbox"
                        checked={selectedIds.includes(p._id)}
                        onChange={() => onSelect(p._id)}
                        className="sr-only peer"
                    />
                    <div className="w-6 h-6 rounded-lg border-2 border-slate-200 dark:border-zinc-700 peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all shadow-sm">
                        <Check
                            className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100"
                            strokeWidth={4}
                        />
                    </div>
                </label>
            </td>
            <td className="px-8 py-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 group-hover:border-orange-400/40 dark:group-hover:border-orange-900 transition-all shadow-sm">
                        {p.image ? (
                            <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200 dark:text-zinc-800">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="font-black text-slate-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors uppercase tracking-tight" title={p.name}>
                            {p.name}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-black mt-1 uppercase tracking-widest">
                            #{p._id.slice(-8).toUpperCase()}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-8 py-6">
                <span className="px-3 py-1 rounded-full text-[10px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-800 uppercase tracking-widest">
                    {p.categoryId?.name || '-'}
                </span>
            </td>
            <td className="px-8 py-6 text-right">
                <div className="font-black text-slate-900 dark:text-white tabular-nums">{formatPrice(p.price)}</div>
            </td>
            <td className="px-8 py-6 text-center">
                <div className="font-black text-slate-600 dark:text-slate-300 tabular-nums text-lg">
                    {p.stock_quantity || 0}
                </div>
            </td>
            <td className="px-8 py-6 text-center">
                <span
                    className={cn(
                        'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border',
                        status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
                    )}
                >
                    {status === 'Active' ? 'Còn hàng' : 'Hết hàng'}
                </span>
            </td>
            <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button
                        onClick={() => onEdit(p)}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 border border-transparent hover:border-orange-100 dark:hover:border-orange-900/30 rounded-xl transition-all"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(p._id)}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30 rounded-xl transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
});

const ProductTable = React.memo(({ products, selectedIds, onSelect, onSelectAll, sortConfig, onSort, onEdit, onDelete }) => {
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column)
            return (
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            );
        return (
            <ArrowUpDown
                className={cn(
                    'w-3.5 h-3.5 text-orange-600 dark:text-orange-500 transition-transform',
                    sortConfig.direction === 'desc' ? 'rotate-180' : '',
                )}
            />
        );
    };

    return (
        <div className="admin-card overflow-hidden border-white/40 dark:border-zinc-800/50 p-0 rounded-[2.5rem] bg-white/50 dark:bg-zinc-900/50">
            <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30">
                            <th className="px-8 py-6 w-14">
                                <label className="flex items-center cursor-pointer justify-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === products.length && products.length > 0}
                                        onChange={onSelectAll}
                                        className="sr-only peer"
                                    />
                                    <div className="w-6 h-6 rounded-lg border-2 border-slate-200 dark:border-zinc-700 peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all shadow-sm">
                                        <Check
                                            className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100"
                                            strokeWidth={4}
                                        />
                                    </div>
                                </label>
                            </th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest cursor-pointer group" onClick={() => onSort('name')}>
                                <div className="flex items-center gap-2">
                                    Món ăn <SortIcon column="name" />
                                </div>
                            </th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest cursor-pointer group" onClick={() => onSort('category')}>
                                <div className="flex items-center gap-2">
                                    Danh mục <SortIcon column="category" />
                                </div>
                            </th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest cursor-pointer group text-right" onClick={() => onSort('price')}>
                                <div className="flex items-center gap-2 justify-end">
                                    Đơn giá <SortIcon column="price" />
                                </div>
                            </th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest cursor-pointer group text-center" onClick={() => onSort('stock_quantity')}>
                                <div className="flex items-center gap-2 justify-center">
                                    Kho <SortIcon column="stock_quantity" />
                                </div>
                            </th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Trạng thái</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                        {products.map((p) => (
                            <ProductRow
                                key={p._id}
                                p={p}
                                selectedIds={selectedIds}
                                onSelect={onSelect}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                formatPrice={formatPrice}
                            />
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="7" className="px-8 py-32 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-24 h-24 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center border border-slate-100 dark:border-zinc-700 shadow-xl opacity-30">
                                            <ImageIcon className="text-slate-900 dark:text-white" size={48} strokeWidth={1} />
                                        </div>
                                        <p className="text-slate-900 dark:text-white font-black uppercase tracking-widest">Không tìm thấy món ăn nào</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

const ProductForm = ({ isOpen, onClose, onSubmit, initialData, categories, isSubmitting }) => {
    const [form, setForm] = useState({ name: '', price: '', categoryId: '', stock_quantity: 0, image: '' });

    useEffect(() => {
        if (initialData) {
            setForm({
                _id: initialData._id,
                name: initialData.name || '',
                price: initialData.price || '',
                categoryId: initialData.categoryId?._id || initialData.categoryId || '',
                stock_quantity: initialData.stock_quantity || 0,
                image: initialData.image || '',
            });
        } else {
            setForm({ name: '', price: '', categoryId: categories[0]?._id || '', stock_quantity: 0, image: '' });
        }
    }, [initialData, isOpen, categories]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white dark:border-zinc-800 animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                <div className="p-10 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-orange-600 dark:bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-100 dark:shadow-none">
                            {initialData ? <Edit2 size={24} /> : <Plus size={24} />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                {initialData ? 'Cấu hình thực đơn' : 'Thiết lập món mới'}
                            </h2>
                            <p className="text-orange-600 dark:text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Menu configuration system</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                        <X size={20} className="text-slate-400 dark:text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                    {/* Image Area */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Visual Identity</label>
                        <div className="flex gap-8 items-start">
                            <div className="w-40 h-40 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors shrink-0 shadow-inner group hover:border-orange-400 dark:hover:border-orange-900 transition-all duration-500">
                                {form.image ? (
                                    <img src={form.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <ImageIcon className="w-12 h-12 text-slate-200 dark:text-zinc-800" strokeWidth={1} />
                                )}
                            </div>
                            <div className="flex-1 space-y-4">
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                                    Vui lòng cung cấp URL hình ảnh chất lượng cao để đảm bảo hiển thị tối ưu trên thiết bị của khách hàng.
                                </p>
                                <input
                                    value={form.image}
                                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="admin-input h-14 bg-slate-50 dark:bg-zinc-950 border-transparent focus:bg-white dark:focus:bg-zinc-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Tên thực thể</label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Vd: Sushi Cá Hồi Đặc Biệt"
                            className="admin-input h-16 text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Đơn giá niêm yết</label>
                            <div className="relative">
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                    className="admin-input h-16 pl-12 font-black text-orange-600 dark:text-orange-500 text-xl tabular-nums bg-white dark:bg-zinc-950"
                                />
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 dark:text-zinc-700 uppercase tracking-widest text-[10px]">đ</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Định lượng khả dụng</label>
                            <input
                                required
                                type="number"
                                min="0"
                                value={form.stock_quantity}
                                onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) })}
                                className="admin-input h-16 font-black text-slate-900 dark:text-white text-xl tabular-nums bg-white dark:bg-zinc-950"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Phân loại danh mục</label>
                        <div className="relative">
                            <select
                                required
                                value={form.categoryId}
                                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                className="admin-input h-16 px-6 font-black uppercase tracking-widest text-xs appearance-none text-slate-900 dark:text-white bg-white dark:bg-zinc-950"
                            >
                                <option value="" disabled className="dark:bg-zinc-900">Chọn danh mục</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id} className="dark:bg-zinc-900">{c.name}</option>
                                ))}
                            </select>
                            <MoreHorizontal className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-zinc-700 pointer-events-none" />
                        </div>
                    </div>
                </form>

                <div className="p-10 border-t border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-800/50 flex gap-6">
                    <button
                        type="button"
                        onClick={onClose}
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
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <Zap size={18} /> Lưu thay đổi
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ========================
// 3. MAIN PAGE
// ========================

const AdminProducts = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const roleName = (user?.roleId?.name || user?.role || '').toString().toLowerCase();
    const isAdmin = roleName === 'admin';

    // States
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedIds, setSelectedIds] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([getProductsApi(), getCategoryApi()]);
            setProducts(prodRes?.data || prodRes || []);
            setCategories(catRes?.data || catRes || []);
        } catch (err) {
            console.error('Failed to load data', err);
            toast.error('Không thể tải cơ sở dữ liệu thực đơn');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = [...products];
        if (search) {
            const query = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name?.toLowerCase().includes(query) ||
                    p.categoryId?.name?.toLowerCase().includes(query),
            );
        }
        if (filterCategory !== 'All') {
            result = result.filter((p) => p.categoryId?._id === filterCategory || p.categoryId === filterCategory);
        }
        if (filterStatus !== 'All') {
            result = result.filter((p) => {
                const status = p.stock_quantity > 0 ? 'Active' : 'Out of stock';
                return status === filterStatus;
            });
        }

        result.sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            if (sortConfig.key === 'category') {
                aVal = a.categoryId?.name || '';
                bVal = b.categoryId?.name || '';
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [products, search, filterCategory, filterStatus, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const handleSelect = (id) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredProducts.length && filteredProducts.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredProducts.map((p) => p._id));
        }
    };

    const handleSave = async (form) => {
        if (!form.name.trim() || !form.price || !form.categoryId) {
            toast.warning('Vui lòng điền đầy đủ các tham số bắt buộc');
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingProduct) {
                await updateProductApi(editingProduct._id, form);
                toast.success('Cập nhật món ăn thành công');
            } else {
                await createProductApi(form);
                toast.success('Thiết lập món mới hoàn tất');
            }
            setIsFormOpen(false);
            setEditingProduct(null);
            fetchData();
        } catch (err) {
            console.error('Submit failed', err);
            toast.error(editingProduct ? 'Cập nhật thất bại' : 'Thêm mới thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        setIsSubmitting(true);
        try {
            if (deletingId === 'bulk') {
                for (const id of selectedIds) {
                    await deleteProductApi(id);
                }
                setSelectedIds([]);
                toast.success(`Đã loại bỏ ${selectedIds.length} thực thể khỏi thực đơn`);
            } else {
                await deleteProductApi(deletingId);
                toast.success('Đã xóa món ăn thành công');
            }
            setIsDeleteOpen(false);
            setDeletingId(null);
            fetchData();
        } catch (err) {
            console.error('Delete failed', err);
            toast.error('Xóa món ăn thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterCategory, filterStatus]);

    return (
        <AdminLayout className="space-y-10">
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Thực đơn</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                        Quản lý ma trận món ăn, cấu trúc giá và định lượng tồn kho vật lý.
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    {selectedIds.length > 0 && isAdmin && (
                        <button
                            onClick={() => {
                                setDeletingId('bulk');
                                setIsDeleteOpen(true);
                            }}
                            className="h-14 px-8 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-100 dark:border-rose-900/30 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Trash2 size={18} /> Xóa ({selectedIds.length})
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            onClick={() => {
                                setEditingProduct(null);
                                setIsFormOpen(true);
                            }}
                            className="flex-1 lg:flex-none h-14 px-10 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg dark:shadow-none shadow-orange-100 transition-all flex items-center justify-center gap-3"
                        >
                            <Plus size={20} /> Thêm món ăn
                        </button>
                    )}
                </div>
            </div>

            {/* FILTER BAR */}
            <ProductFilter
                search={search}
                setSearch={setSearch}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                categories={categories}
            />

            {/* CONTENT OR LOADER */}
            {loading ? (
                <AdminLoading message="Đang đồng bộ thực đơn..." />
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <ProductTable
                        products={paginatedProducts}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                        onSelectAll={handleSelectAll}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        onEdit={(p) => {
                            setEditingProduct(p);
                            setIsFormOpen(true);
                        }}
                        onDelete={(id) => {
                            setDeletingId(id);
                            setIsDeleteOpen(true);
                        }}
                    />
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredProducts.length}
                        itemsPerPage={itemsPerPage}
                        className="mt-6 rounded-[2.5rem] shadow-sm border-white/40 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50"
                    />
                </div>
            )}

            {/* PRODUCT FORM */}
            <ProductForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSave}
                initialData={editingProduct}
                categories={categories}
                isSubmitting={isSubmitting}
            />

            {/* DELETE CONFIRMATION */}
            {isDeleteOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-w-md p-12 shadow-2xl text-center border border-white dark:border-zinc-800 animate-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-rose-100 dark:border-rose-900/30 shadow-lg shadow-rose-50">
                            <Trash2 size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">Xác nhận xóa?</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-10 font-bold text-sm leading-relaxed">
                            {deletingId === 'bulk'
                                ? `Bạn có chắc chắn muốn loại bỏ ${selectedIds.length} món ăn khỏi hệ thống không?`
                                : 'Hành động này sẽ xóa vĩnh viễn món ăn khỏi thực đơn hiện hữu.'}
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDeleteOpen(false)}
                                disabled={isSubmitting}
                                className="flex-1 h-16 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isSubmitting}
                                className="flex-1 h-16 rounded-2xl bg-rose-600 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-100 dark:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Xác nhận xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProducts;
