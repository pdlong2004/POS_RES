import React, { useEffect, useState } from 'react';
import SidebarAdmin from '@/components/admin/shared/SidebarAdmin';
import HeaderAdmin from '@/components/admin/shared/HeaderAdmin';
import { getSuppliersApi, createSupplierApi, updateSupplierApi, deleteSupplierApi } from '@/service/supplier.service';
import { Plus, Search, Loader2, Edit2, Trash2, X, Truck } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const AdminSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [form, setForm] = useState({ name: '', phone: '', address: '' });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getSuppliersApi();
            setSuppliers(res?.data || res || []);
        } catch (err) {
            console.error('Failed to load data', err);
            toast.error('Không thể tải dữ liệu nhà cung cấp');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openCreateModal = () => {
        setEditingSupplier(null);
        setForm({ name: '', phone: '', address: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (supplier) => {
        setEditingSupplier(supplier);
        setForm({
            name: supplier.name || '',
            phone: supplier.phone || '',
            address: supplier.address || '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSupplier(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.warning('Vui lòng nhập tên nhà cung cấp');
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingSupplier) {
                await updateSupplierApi(editingSupplier._id, form);
                toast.success('Cập nhật thành công');
            } else {
                await createSupplierApi(form);
                toast.success('Thêm mới thành công');
            }
            closeModal();
            fetchData();
        } catch (err) {
            console.error('Submit failed', err);
            toast.error(editingSupplier ? 'Cập nhật thất bại' : 'Thêm mới thất bại');
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
            toast.success('Đã xóa nhà cung cấp');
            setIsDeleteModalOpen(false);
            setDeletingId(null);
            fetchData();
        } catch (err) {
            console.error('Delete failed', err);
            toast.error('Xóa nhà cung cấp thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredSuppliers = suppliers.filter((s) =>
        s.name?.toLowerCase().includes(search.toLowerCase()) || 
        s.phone?.includes(search)
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
                                    <div className="p-2 bg-indigo-500/10 rounded-xl">
                                        <Truck className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    Quản lý nhà cung cấp
                                </h1>
                                <p className="text-sm text-gray-500 mt-2">
                                    Thêm, sửa, xóa thông tin nhà cung cấp nguyên vật liệu
                                </p>
                            </div>

                            <div className="flex items-center gap-3 w-full xl:w-auto">
                                <div className="relative flex-1 xl:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Tìm tên hoặc SĐT..."
                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                    />
                                </div>
                                <button
                                    onClick={openCreateModal}
                                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all focus:ring-2 focus:ring-indigo-500/20 active:scale-95 whitespace-nowrap shadow-sm shadow-indigo-600/20"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="hidden sm:inline">Thêm mới</span>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-100">
                                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                                <p className="text-gray-500 font-medium">Đang tải danh sách nhà cung cấp...</p>
                            </div>
                        ) : filteredSuppliers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-100">
                                <div className="p-4 bg-gray-50 rounded-full mb-4">
                                    <Truck className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Không có dữ liệu</h3>
                                <p className="text-gray-500 text-center max-w-sm">
                                    Thử thay đổi từ khóa hoặc thêm nhà cung cấp mới.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                <th className="p-4 font-semibold text-gray-600">Nhà cung cấp</th>
                                                <th className="p-4 font-semibold text-gray-600">Số điện thoại</th>
                                                <th className="p-4 font-semibold text-gray-600">Địa chỉ</th>
                                                <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSuppliers.map((s) => (
                                                <tr key={s._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-bold text-gray-900">{s.name}</div>
                                                    </td>
                                                    <td className="p-4 text-gray-600">
                                                        {s.phone || '-'}
                                                    </td>
                                                    <td className="p-4 text-gray-600 max-w-xs truncate" title={s.address}>
                                                        {s.address || '-'}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => openEditModal(s)}
                                                                className="p-1.5 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg transition-colors border border-gray-200 hover:border-blue-200"
                                                                title="Sửa"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => openDeleteConfirm(s._id)}
                                                                className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors border border-gray-200 hover:border-red-200"
                                                                title="Xoá"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
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
                </main>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingSupplier ? 'Sửa thông tin' : 'Thêm nhà cung cấp mới'}
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
                                    Tên nhà cung cấp <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    placeholder="Điền tên nhà cung cấp..."
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Số điện thoại
                                </label>
                                <input
                                    value={form.phone}
                                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                                    placeholder="0123.456.789"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Địa chỉ
                                </label>
                                <input
                                    value={form.address}
                                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                                    placeholder="Địa chỉ..."
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
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
                                    className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 min-w-30 justify-center"
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
                        <p className="text-gray-500 mb-6">
                            Bạn có chắc chắn muốn xóa không? Hành động này không thể hoàn tác.
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

export default AdminSuppliers;
