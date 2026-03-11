import React, { useEffect, useState } from 'react';
import SidebarAdmin from '@/components/admin/shared/SidebarAdmin';
import HeaderAdmin from '@/components/admin/shared/HeaderAdmin';
import { getProductsApi, updateProductApi } from '@/service/products.service';
import { Search, Loader2, Edit2, X, Package, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { socket } from '@/socket';

const AdminInventory = () => {
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
            toast.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const handleStockUpdate = (data) => {
            setProducts((prevProducts) => 
                prevProducts.map(p => {
                    if (p._id === data.productId) {
                        const newQuantity = data.newStock !== undefined 
                            ? data.newStock 
                            : (p.stock_quantity + (data.quantityAdded || 0));
                        return { ...p, stock_quantity: newQuantity };
                    }
                    return p;
                })
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

        if (stockQuantity < 0) {
            toast.warning('Số lượng không hợp lệ');
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingProduct) {
                await updateProductApi(editingProduct._id, { stock_quantity: stockQuantity });
                toast.success('Cập nhật số lượng kho thành công');
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
                                    <div className="p-2 bg-blue-500/10 rounded-xl">
                                        <Package className="w-6 h-6 text-blue-500" />
                                    </div>
                                    Kiểm soát số lượng kho
                                </h1>
                                <p className="text-sm text-gray-500 mt-2">
                                    Quản lý số lượng tồn kho của các sản phẩm
                                </p>
                            </div>

                            <div className="flex items-center gap-3 w-full xl:w-auto">
                                <div className="relative flex-1 xl:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Tìm tên món hoặc nhóm..."
                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-100">
                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                                <p className="text-gray-500 font-medium">Đang tải danh sách kho...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-100">
                                <div className="p-4 bg-gray-50 rounded-full mb-4">
                                    <Package className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy món ăn nào</h3>
                                <p className="text-gray-500 text-center max-w-sm">
                                    Thử thay đổi từ khóa tìm kiếm.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                <th className="p-4 font-semibold text-gray-600">Sản phẩm</th>
                                                <th className="p-4 font-semibold text-gray-600">Danh mục</th>
                                                <th className="p-4 font-semibold text-gray-600 text-center">Tồn kho</th>
                                                <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.map((p) => (
                                                <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                                {p.image ? (
                                                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                                                ) : null}
                                                                <div className="flex gap-1 items-center justify-center text-gray-400" style={{ display: p.image ? 'none' : 'flex' }}>
                                                                    <ImageIcon className="w-5 h-5 opacity-50" />
                                                                </div>
                                                            </div>
                                                            <div className="font-medium text-gray-900 line-clamp-2">{p.name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-gray-600">
                                                        {p.categoryId?.name || '-'}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${p.stock_quantity > 10 ? 'bg-green-100 text-green-800' : p.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                            {p.stock_quantity || 0}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button
                                                            onClick={() => openEditModal(p)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                            Cập nhật
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
                </main>
            </div>

            {/* Edit Stock Modal */}
            {isModalOpen && editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                Cập nhật tồn kho
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
                                <label className="block text-sm text-gray-500 mb-1">
                                    Sản phẩm
                                </label>
                                <div className="font-medium text-gray-900 mb-4">{editingProduct.name}</div>

                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Số lượng hiện tại trong kho <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    value={stockQuantity}
                                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg font-semibold"
                                />
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                    className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lưu lại'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInventory;
