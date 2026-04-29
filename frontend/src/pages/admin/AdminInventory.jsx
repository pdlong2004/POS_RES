import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import AdminLoading from '@/components/admin/shared/AdminLoading';
import { getProductsApi, updateProductApi } from '@/service/products.service';
import {
    Search,
    Loader2,
    Edit2,
    X,
    Package,
    Image as ImageIcon,
    RefreshCw,
    AlertCircle,
    Archive,
    Zap,
    ShieldCheck,
    Activity,
    TrendingDown,
    TrendingUp,
    Terminal,
    ArrowRight,
    Filter,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { socket } from '@/socket';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import Pagination from '@/components/admin/shared/Pagination';

const AdminInventory = () => {
    const { user } = useAuth();
    const roleName = (user?.roleId?.name || user?.role || '').toString().toLowerCase();
    const isAdmin = roleName === 'admin';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [stockQuantity, setStockQuantity] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        try {
            const prodRes = await getProductsApi();
            setProducts(prodRes?.data || prodRes || []);
        } catch (err) {
            console.error('Failed to load data', err);
            toast.error('Không thể đồng bộ ma trận tồn kho');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const handleStockUpdate = (data) => {
            setProducts((prevProducts) =>
                prevProducts.map((p) => {
                    if (p._id === data.productId) {
                        const newQuantity =
                            data.newStock !== undefined ? data.newStock : p.stock_quantity + (data.quantityAdded || 0);
                        return { ...p, stock_quantity: newQuantity };
                    }
                    return p;
                }),
            );
        };

        socket.on('stockUpdated', handleStockUpdate);

        return () => {
            socket.off('stockUpdated', handleStockUpdate);
        };
    }, []);

    const openEditModal = (product) => {
        setEditingProduct(product);
        setStockQuantity(product.stock_quantity || 0);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (stockQuantity < 0) return toast.warning('Giá trị định lượng không hợp lệ');

        setIsSubmitting(true);
        try {
            if (editingProduct) {
                await updateProductApi(editingProduct._id, { stock_quantity: stockQuantity });
                toast.success('Đã hiệu chỉnh định mức kho thành công');
            }
            closeModal();
            fetchData();
        } catch (err) {
            console.error('Submit failed', err);
            toast.error('Cập nhật thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProducts = products.filter(
        (p) =>
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.categoryId?.name?.toLowerCase().includes(search.toLowerCase()),
    );

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    return (
        <AdminLayout className="space-y-10">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Ma trận tồn kho</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                        Giám sát định lượng thực tế và điều phối nguồn lực vật tư thời gian thực.
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-6 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 uppercase tracking-widest">
                        <Zap size={14} /> Live Sync
                    </div>
                    <button
                        onClick={fetchData}
                        className="admin-btn-secondary w-12 h-12 flex items-center justify-center p-0 dark:bg-zinc-900/50 dark:border-zinc-800"
                        title="Làm mới"
                    >
                        <RefreshCw size={18} className={cn(loading && 'animate-spin')} />
                    </button>
                </div>
            </div>

            {/* ANALYTICS PREVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                {[
                    {
                        label: 'Tổng mặt hàng',
                        value: products.length,
                        icon: Package,
                        color: 'text-orange-600',
                        bg: 'bg-orange-50',
                        border: 'border-orange-100',
                    },
                    {
                        label: 'Ngưỡng cảnh báo',
                        value: products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 10).length,
                        icon: AlertCircle,
                        color: 'text-amber-600',
                        bg: 'bg-amber-50',
                        border: 'border-amber-100',
                    },
                    {
                        label: 'Tuyệt đối cạn kiệt',
                        value: products.filter((p) => (p.stock_quantity || 0) === 0).length,
                        icon: TrendingDown,
                        color: 'text-rose-600',
                        bg: 'bg-rose-50',
                        border: 'border-rose-100',
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="admin-card p-8 group hover:border-orange-400/40 transition-all duration-500 overflow-hidden relative bg-white dark:bg-zinc-900 border-white/20 dark:border-zinc-800/50"
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    {stat.label}
                                </p>
                                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                                    {stat.value}
                                </p>
                            </div>
                            <div
                                className={cn(
                                    'w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-500 shadow-lg group-hover:scale-110',
                                    stat.bg,
                                    stat.color,
                                    stat.border,
                                    'dark:bg-opacity-20 dark:border-opacity-30'
                                )}
                            >
                                <stat.icon size={28} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FILTER BAR */}
            <div className="admin-card p-6 border-white/20 dark:border-zinc-800/50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 bg-white/50 dark:bg-zinc-900/50">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-600 group-focus-within:text-orange-600 dark:group-focus-within:text-orange-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm thực thể trong kho..."
                        className="admin-input pl-14 h-14 bg-white/50 dark:bg-zinc-900 border-white dark:border-zinc-800 font-bold text-slate-900 dark:text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* CONTENT */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center gap-4">
                        <RefreshCw className="h-8 w-8 text-orange-600 dark:text-orange-500 animate-spin" />
                        <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">
                            Đang tải ma trận kho...
                        </p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="admin-card py-32 flex flex-col items-center justify-center bg-white/30 dark:bg-zinc-900/30 border-white dark:border-zinc-800 rounded-[3rem]">
                        <div className="w-24 h-24 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-8 border border-white dark:border-zinc-800 shadow-xl dark:shadow-none opacity-30">
                            <Package size={48} strokeWidth={1} className="text-slate-900 dark:text-white" />
                        </div>
                        <p className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-base">
                            Hệ thống kho rỗng
                        </p>
                    </div>
                ) : (
                    <div className="admin-card overflow-hidden border-white/40 dark:border-zinc-800/50 p-0 rounded-[2.5rem] bg-white/50 dark:bg-zinc-900/50">
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50">
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sản phẩm</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Phân loại</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Trạng thái</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Tồn kho</th>
                                        {isAdmin && <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Hành động</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                                    {paginatedProducts.map((p) => {
                                        const stock = p.stock_quantity || 0;
                                        const isLow = stock > 0 && stock <= 10;
                                        const isOut = stock === 0;

                                        return (
                                            <tr key={p._id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 overflow-hidden flex items-center justify-center group-hover:border-orange-400/40 dark:group-hover:border-orange-900 transition-all shadow-sm">
                                                            {p.image ? (
                                                                <img
                                                                    src={p.image}
                                                                    alt={p.name}
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                                />
                                                            ) : (
                                                                <ImageIcon className="w-6 h-6 text-slate-200 dark:text-zinc-700" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors truncate text-base tracking-tight uppercase">
                                                                {p.name}
                                                            </p>
                                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                                                                #{p._id.slice(-8).toUpperCase()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="px-3 py-1 rounded-full text-[10px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-800 uppercase tracking-widest">
                                                        {p.categoryId?.name || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    {isOut ? (
                                                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100">
                                                            Cạn kiệt
                                                        </span>
                                                    ) : isLow ? (
                                                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100 animate-pulse">
                                                            Sắp hết
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                                                            An toàn
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span
                                                            className={cn(
                                                                'font-black text-2xl tracking-tighter tabular-nums',
                                                                isOut ? 'text-rose-600 dark:text-rose-400' : isLow ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white',
                                                            )}
                                                        >
                                                            {stock}
                                                        </span>
                                                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Units</span>
                                                    </div>
                                                </td>
                                                {isAdmin && (
                                                    <td className="px-8 py-6 text-right">
                                                        <button
                                                            onClick={() => openEditModal(p)}
                                                            className="w-10 h-10 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-100 dark:hover:border-orange-900 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={filteredProducts.length}
                            itemsPerPage={itemsPerPage}
                            className="bg-white/30 dark:bg-zinc-900/30"
                        />
                    </div>
                )}
            </div>

            {/* EDIT MODAL */}
            {isModalOpen && editingProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white dark:border-zinc-800 animate-in zoom-in-95 duration-500">
                        <div className="p-10 space-y-10 bg-white/50 dark:bg-zinc-900/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Cập nhật tồn kho</h2>
                                        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Inventory Management</p>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                                    <X size={20} className="text-slate-400 dark:text-slate-500" />
                                </button>
                            </div>

                            <div className="p-8 bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 rounded-[2rem] flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shrink-0 shadow-sm">
                                    {editingProduct.image ? (
                                        <img src={editingProduct.image} alt={editingProduct.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-slate-200" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">Đang chỉnh sửa</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white truncate uppercase">{editingProduct.name}</p>
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">ID: #{editingProduct._id.slice(-8).toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Số lượng tồn kho thực tế</label>
                                <div className="flex items-center gap-6">
                                    <button
                                        type="button"
                                        onClick={() => setStockQuantity(Math.max(0, stockQuantity - 1))}
                                        className="w-16 h-16 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-900 dark:text-white shadow-sm hover:border-orange-600 dark:hover:border-orange-500 transition-all"
                                    >
                                        −
                                    </button>
                                    <div className="flex-1 relative">
                                        <input
                                            type="number"
                                            value={stockQuantity}
                                            onChange={(e) => setStockQuantity(Number(e.target.value))}
                                            className="w-full admin-input h-16 text-center text-4xl font-black text-orange-600 dark:text-orange-500 bg-slate-50 dark:bg-zinc-800 border-none"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setStockQuantity(stockQuantity + 1)}
                                        className="w-16 h-16 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-900 dark:text-white shadow-sm hover:border-orange-600 dark:hover:border-orange-500 transition-all"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 py-4 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 rounded-2xl bg-orange-600 text-white text-xs font-black uppercase tracking-widest hover:bg-orange-700 shadow-xl dark:shadow-none shadow-orange-100 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Xác nhận lưu'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminInventory;
