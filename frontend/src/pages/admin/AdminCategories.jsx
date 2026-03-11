import React, { useState, useEffect } from 'react';
import HeaderAdmin from '@/components/admin/shared/HeaderAdmin';
import SidebarAdmin from '@/components/admin/shared/SidebarAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { getCategoryApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from '@/service/category.service';


const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', active: true });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await getCategoryApi();
            setCategories(res.data);
        } catch (error) {
            showToast('Không thể lấy danh sách danh mục', 'error');
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
        if (!formData.name.trim()) {
            showToast('Tên danh mục không được để trống', 'error');
            return;
        }

        try {
            if (currentCategory) {
                await updateCategoryApi(currentCategory._id, formData);
                showToast('Đã cập nhật danh mục', 'success');
            } else {
                await createCategoryApi(formData);
                showToast('Đã thêm danh mục mới', 'success');
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            showToast(currentCategory ? 'Không thể cập nhật danh mục' : 'Không thể tạo danh mục', 'error');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCategoryApi(currentCategory._id);
            showToast('Đã xóa danh mục', 'success');
            setIsDeleting(false);
            setCurrentCategory(null);
            fetchCategories();
        } catch (error) {
            showToast('Không thể xóa danh mục', 'error');
        }
    };

    const filteredCategories = categories.filter((c) =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <HeaderAdmin />
            <div className="flex flex-1 overflow-hidden">
                <SidebarAdmin />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-6xl mx-auto space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Quản lý Danh mục</h1>
                                <p className="text-slate-500">Thêm, sửa, xóa các danh mục sản phẩm</p>
                            </div>
                            <Button onClick={() => handleOpenModal()} className="bg-orange-600 hover:bg-orange-700">
                                <Plus className="w-5 h-5 mr-2" />
                                Theo Danh mục mới
                            </Button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                                <div className="relative max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        placeholder="Tìm kiếm danh mục..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-white"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="p-4 font-medium text-slate-600">ID</th>
                                            <th className="p-4 font-medium text-slate-600">Tên danh mục</th>
                                            <th className="p-4 font-medium text-slate-600">Trạng thái</th>
                                            <th className="p-4 font-medium text-slate-600">Ngày tạo</th>
                                            <th className="p-4 font-medium text-slate-600 text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center">
                                                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
                                                </td>
                                            </tr>
                                        ) : filteredCategories.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-slate-500">
                                                    Không tìm thấy danh mục nào
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredCategories.map((category, index) => (
                                                <tr key={category._id || index} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-500">
                                                        {category._id ? category._id.slice(-6).toUpperCase() : 'N/A'}
                                                    </td>
                                                    <td className="p-4 font-medium text-slate-900">{category.name}</td>
                                                    <td className="p-4">
                                                        <span
                                                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                                category.active
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : 'bg-slate-100 text-slate-700'
                                                            }`}
                                                        >
                                                            {category.active ? 'Hoạt động' : 'Đã ẩn'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-slate-500">
                                                        {category.createdAt
                                                            ? new Date(category.createdAt).toLocaleDateString()
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleOpenModal(category)}
                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    setCurrentCategory(category);
                                                                    setIsDeleting(true);
                                                                }}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
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
                </main>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md animate-in zoom-in-95">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">{currentCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Tên danh mục</label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Nhập tên..."
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <label htmlFor="active" className="font-normal text-slate-700">
                                        Kích hoạt
                                    </label>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Hủy
                                </Button>
                                <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 text-white">
                                    {currentCategory ? 'Cập nhật' : 'Thêm mới'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirm Modal */}
            {isDeleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md animate-in zoom-in-95">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">Xóa danh mục</h2>
                            <p className="text-slate-500 mb-6">
                                Bạn có chắc chắn muốn xóa danh mục <span className="font-bold text-slate-900">{currentCategory?.name}</span>? 
                                Thao tác này không thể hoàn tác.
                            </p>
                            <div className="flex justify-center gap-3">
                                <Button variant="outline" onClick={() => setIsDeleting(false)}>
                                    Hủy
                                </Button>
                                <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                                    Xác nhận xóa
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
