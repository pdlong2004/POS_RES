import React, { useEffect, useState } from 'react';
import SidebarAdmin from '@/components/admin/shared/SidebarAdmin';
import HeaderAdmin from '@/components/admin/shared/HeaderAdmin';
import { getProductsApi, createProductApi, updateProductApi, deleteProductApi } from '@/service/products.service';
import { getCategoryApi } from '@/service/category.service';
import { Plus, Search, Loader2, Edit2, Trash2, X, Coffee, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState({ name: '', price: '', categoryId: '', image: '' });


    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([getProductsApi(), getCategoryApi()]);
            setProducts(prodRes?.data || prodRes || []);
            setCategories(catRes?.data || catRes || []);
        } catch (err) {
            console.error('Failed to load data', err);
            toast.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openCreateModal = () => {
        setEditingProduct(null);
        setForm({ name: '', price: '', categoryId: categories[0]?._id || '', image: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name || '',
            price: product.price || '',
            categoryId: product.categoryId?._id || product.categoryId || '',
            image: product.image || '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim() || !form.price || !form.categoryId) {
            toast.warning('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingProduct) {
                await updateProductApi(editingProduct._id, form);
                toast.success('Cập nhật món ăn thành công');
            } else {
                await createProductApi(form);
                toast.success('Thêm món ăn thành công');
            }
            closeModal();
            fetchData();
        } catch (err) {
            console.error('Submit failed', err);
            toast.error(editingProduct ? 'Cập nhật thất bại' : 'Thêm mới thất bại');
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
            await deleteProductApi(deletingId);
            toast.success('Đã xóa món ăn');
            setIsDeleteModalOpen(false);
            setDeletingId(null);
            fetchData();
        } catch (err) {
            console.error('Delete failed', err);
            toast.error('Xóa món ăn thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    const filteredProducts = products.filter(
        (p) =>
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.categoryId?.name?.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            <HeaderAdmin />

            <div className="flex flex-1 overflow-hidden">
                <SidebarAdmin />

                <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 lg:p-8 relative">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Page Header */}
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <div className="p-2 bg-[#F89520]/10 rounded-xl">
                                        <Coffee className="w-6 h-6 text-[#F89520]" />
                                    </div>
                                    Quản lý món ăn
                                </h1>
                                <p className="text-sm text-gray-500 mt-2">
                                    Thêm, sửa, xoá và quản lý danh sách món ăn, đồ uống
                                </p>
                            </div>

                            <div className="flex items-center gap-3 w-full xl:w-auto">
                                <div className="relative flex-1 xl:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Tìm tên món hoặc nhóm..."
                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F89520]/20 focus:border-[#F89520] transition-all text-sm"
                                    />
                                </div>
                                <button
                                    onClick={openCreateModal}
                                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#F89520] hover:bg-[#E07F10] text-white rounded-xl font-medium transition-all focus:ring-2 focus:ring-[#F89520]/20 active:scale-95 whitespace-nowrap shadow-sm shadow-[#F89520]/20"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="hidden sm:inline">Thêm món</span>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-100">
                                <Loader2 className="w-10 h-10 text-[#F89520] animate-spin mb-4" />
                                <p className="text-gray-500 font-medium">Đang tải danh sách món ăn...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-100">
                                <div className="p-4 bg-gray-50 rounded-full mb-4">
                                    <Coffee className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy món ăn nào</h3>
                                <p className="text-gray-500 text-center max-w-sm">
                                    {search
                                        ? 'Thử thay đổi từ khóa tìm kiếm.'
                                        : 'Bắt đầu thêm món mới cho nhà hàng của bạn.'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                                {filteredProducts.map((p) => (
                                    <div
                                        key={p._id}
                                        className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#F89520]/30 hover:shadow-md transition-all overflow-hidden flex flex-col h-full"
                                    >
                                        <div className="aspect-video w-full bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                            {p.image ? (
                                                <img
                                                    src={p.image}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className="absolute inset-0 flex flex-col items-center justify-center text-gray-400"
                                                style={{ display: p.image ? 'none' : 'flex' }}
                                            >
                                                <ImageIcon className="w-10 h-10 opacity-50 mb-2" />
                                                <span className="text-xs font-medium">No Image</span>
                                            </div>
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 flex items-center rounded-lg text-xs font-bold text-[#F89520] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                                {p.categoryId?.name || '-'}
                                            </div>
                                        </div>

                                        <div className="p-4 flex flex-col flex-1">
                                            <h3
                                                className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-[#F89520] transition-colors"
                                                title={p.name}
                                            >
                                                {p.name}
                                            </h3>

                                            <div className="mt-auto pt-3 flex items-end justify-between border-t border-gray-50">
                                                <div className="font-bold text-[#C0392B] text-lg">
                                                    {formatPrice(p.price)}
                                                </div>

                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEditModal(p)}
                                                        className="p-1.5 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg transition-colors border border-gray-200 hover:border-blue-200"
                                                        title="Sửa món"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteConfirm(p._id)}
                                                        className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors border border-gray-200 hover:border-red-200"
                                                        title="Xoá món"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingProduct ? 'Sửa món ăn' : 'Thêm món ăn mới'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Tên món <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    placeholder="Ví dụ: Cà phê sữa đá"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F89520]/20 focus:border-[#F89520] transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Giá bán (VNĐ) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        value={form.price}
                                        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                                        placeholder="Ví dụ: 35000"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F89520]/20 focus:border-[#F89520] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Danh mục <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={form.categoryId}
                                            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                                            className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F89520]/20 focus:border-[#F89520] transition-all pr-10"
                                        >
                                            <option value="" disabled>
                                                Chọn danh mục
                                            </option>
                                            {categories.map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2.5"
                                                    d="M19 9l-7 7-7-7"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Link ảnh (tùy chọn)
                                </label>
                                <input
                                    value={form.image}
                                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F89520]/20 focus:border-[#F89520] transition-all"
                                />
                                {form.image && (
                                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                                        <div className="w-10 h-10 rounded border overflow-hidden">
                                            <img
                                                src={form.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => (e.target.style.display = 'none')}
                                            />
                                        </div>
                                        <span>Ảnh xem trước</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 bg-[#F89520] text-white font-medium rounded-xl hover:bg-[#E07F10] transition-colors flex items-center gap-2 min-w-30 justify-center"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lưu lại'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận đơn</h3>
                        <p className="text-gray-500 mb-6">
                            Bạn có chắc chắn muốn xóa món ăn này không? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Xóa ngay'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
