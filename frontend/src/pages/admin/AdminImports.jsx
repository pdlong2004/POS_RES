import React, { useEffect, useState } from 'react';
import SidebarAdmin from '@/components/admin/shared/SidebarAdmin';
import HeaderAdmin from '@/components/admin/shared/HeaderAdmin';
import { getImportsApi, createImportApi, getImportDetailsApi } from '@/service/import.service';
import { getSuppliersApi } from '@/service/supplier.service';
import { getProductsApi } from '@/service/products.service';
import { Plus, Search, Loader2, Eye, FileBox, X, Check, XCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

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
            const [impRes, supRes, prodRes] = await Promise.all([
                getImportsApi(),
                getSuppliersApi(),
                getProductsApi()
            ]);
            
            setImports(impRes?.data || []);
            setSuppliers(supRes?.data || []);
            setProducts(prodRes?.data || []);
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
        setForm({ supplierId: '', items: [] });
        setCurrentItem({ productId: '', quantity: 1, price: 0 });
        setIsCreateModalOpen(true);
    };

    const handleAddItem = () => {
        if (!currentItem.productId || currentItem.quantity <= 0 || currentItem.price <= 0) {
            toast.warning('Vui lòng chọn sản phẩm, nhập số lượng và giá nhập hợp lệ');
            return;
        }

        // Check if product already added
        const existingIndex = form.items.findIndex(i => i.productId === currentItem.productId);
        if (existingIndex >= 0) {
            const newItems = [...form.items];
            newItems[existingIndex].quantity += Number(currentItem.quantity);
            setForm(prev => ({ ...prev, items: newItems }));
        } else {
            setForm(prev => ({ ...prev, items: [...prev.items, { ...currentItem }] }));
        }

        // Reset current draft but keep recent price for convenience or reset entirely
        setCurrentItem({ productId: '', quantity: 1, price: 0 });
    };

    const handleRemoveItem = (index) => {
        const newItems = form.items.filter((_, i) => i !== index);
        setForm(prev => ({ ...prev, items: newItems }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.supplierId) {
            toast.warning('Vui lòng chọn nhà cung cấp');
            return;
        }
        if (form.items.length === 0) {
            toast.warning('Vui lòng thêm ít nhất 1 sản phẩm vào phiếu nhập');
            return;
        }

        setIsSubmitting(true);
        try {
            await createImportApi(form);
            toast.success('Nhập hàng thành công! Đã tự động cộng vào kho.');
            setIsCreateModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Submit failed', err);
            toast.error('Tạo phiếu nhập thất bại');
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
            toast.error('Lỗi khi lấy chi tiết');
            setIsDetailsModalOpen(false);
        } finally {
            setDetailsLoading(false);
        }
    };

    const getProductName = (id) => products.find(p => p._id === id)?.name || 'Unknown';
    
    // Calculates total dynamic cost of the drafted form
    const formTotal = form.items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity) || 0), 0);

    const filteredImports = imports.filter((i) =>
        i.supplierId?.name?.toLowerCase().includes(search.toLowerCase()) || 
        i._id.includes(search)
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
                                    <div className="p-2 bg-emerald-500/10 rounded-xl">
                                        <FileBox className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    Quản lý phiếu nhập hàng
                                </h1>
                                <p className="text-sm text-gray-500 mt-2">
                                    Nhập hàng vào kho và tự động cộng dồn số lượng
                                </p>
                            </div>

                            <div className="flex items-center gap-3 w-full xl:w-auto">
                                <div className="relative flex-1 xl:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Mã phiếu hoặc tên NCC..."
                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                                    />
                                </div>
                                <button
                                    onClick={openCreateModal}
                                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all focus:ring-2 focus:ring-emerald-500/20 active:scale-95 whitespace-nowrap shadow-sm shadow-emerald-600/20"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="hidden sm:inline">Tạo phiếu nhập</span>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-100">
                                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                                <p className="text-gray-500 font-medium">Đang tải lịch sử nhập hàng...</p>
                            </div>
                        ) : filteredImports.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-100">
                                <div className="p-4 bg-gray-50 rounded-full mb-4">
                                    <FileBox className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Chưa có phiếu nhập nào</h3>
                                <p className="text-gray-500 text-center max-w-sm">
                                    Hãy tạo phiếu nhập mới để thêm hàng hóa vào kho.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                <th className="p-4 font-semibold text-gray-600">Mã phiếu</th>
                                                <th className="p-4 font-semibold text-gray-600">Nhà cung cấp</th>
                                                <th className="p-4 font-semibold text-gray-600">Ngày tạo</th>
                                                <th className="p-4 font-semibold text-gray-600 text-right">Tổng tiền</th>
                                                <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredImports.map((imp) => (
                                                <tr key={imp._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                    <td className="p-4 font-mono text-sm text-gray-500">
                                                        {imp._id.slice(-6).toUpperCase()}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-bold text-gray-900">{imp.supplierId?.name || '---'}</div>
                                                    </td>
                                                    <td className="p-4 text-gray-600 text-sm">
                                                        {new Date(imp.createdAt).toLocaleString('vi-VN')}
                                                    </td>
                                                    <td className="p-4 text-right font-bold text-emerald-600">
                                                        {imp.totalPrice?.toLocaleString('vi-VN')}đ
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button
                                                            onClick={() => openDetailsModal(imp._id)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-colors border border-gray-200 hover:border-blue-200 text-sm font-medium"
                                                        >
                                                            <Eye className="w-4 h-4" />
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
                </main>
            </div>

            {/* Create Import Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Tạo phiếu nhập hàng</h2>
                                <p className="text-sm text-gray-500 mt-1">Hàng hóa sẽ tự động được cộng vào tồn kho sau khi lưu.</p>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                            {/* Left Side: Form */}
                            <div className="w-full md:w-5/12 border-r border-gray-100 p-5 md:p-6 overflow-y-auto bg-gray-50/50">
                                <form onSubmit={handleCreateSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Nhà cung cấp <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.supplierId}
                                            onChange={(e) => setForm((f) => ({ ...f, supplierId: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                        >
                                            <option value="">-- Chọn NCC --</option>
                                            {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <Plus className="w-4 h-4 text-emerald-500" /> Thêm sản phẩm
                                        </h3>
                                        
                                        <div className="space-y-3 p-4 bg-white border border-emerald-100 rounded-xl shadow-sm">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1">Mặt hàng</label>
                                                <select
                                                    value={currentItem.productId}
                                                    onChange={e => setCurrentItem(prev => ({ ...prev, productId: e.target.value }))}
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                                >
                                                    <option value="">-- Chọn sản phẩm --</option>
                                                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                                </select>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Số lượng</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={currentItem.quantity}
                                                        onChange={e => setCurrentItem(prev => ({ ...prev, quantity: e.target.value }))}
                                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Đơn giá nhập</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={currentItem.price}
                                                        onChange={e => setCurrentItem(prev => ({ ...prev, price: e.target.value }))}
                                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleAddItem}
                                                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors mt-2 text-sm"
                                            >
                                                Đưa vào danh sách
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-6">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 justify-center shadow-md shadow-emerald-500/20"
                                        >
                                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lưu & Nhập Kho'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Right Side: Added Items Review */}
                            <div className="w-full md:w-7/12 p-5 md:p-6 flex flex-col bg-white">
                                <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex justify-between items-center">
                                    <span>Danh sách hàng hóa</span>
                                    <span className="text-sm font-normal text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                        Tổng: {formTotal.toLocaleString('vi-VN')}đ
                                    </span>
                                </h3>

                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    {form.items.length === 0 ? (
                                        <div className="h-full flex flex-col justify-center items-center text-gray-400">
                                            <FileBox className="w-12 h-12 mb-3 opacity-20" />
                                            <p className="text-sm">Chưa có sản phẩm nào được chọn.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {form.items.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors group bg-white shadow-xs">
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-sm">{getProductName(item.productId)}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {item.quantity} x {Number(item.price).toLocaleString('vi-VN')}đ
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-bold text-emerald-600 text-sm">
                                                            {(item.quantity * item.price).toLocaleString('vi-VN')}đ
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveItem(index)}
                                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {isDetailsModalOpen && selectedImport && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/80 shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Chi tiết Phiếu nhập</h2>
                                <p className="text-xs text-gray-500 font-mono mt-0.5">#{selectedImport.import._id}</p>
                            </div>
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 rounded-full transition-colors"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                        {detailsLoading ? (
                            <div className="flex-1 flex justify-center items-center">
                                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar">
                                <div className="space-y-6">
                                    {/* Info Panel */}
                                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-emerald-200/50">
                                            <span className="text-sm font-medium text-emerald-800">NCC:</span>
                                            <span className="font-bold text-emerald-900">{selectedImport.import.supplierId?.name || 'Vãng lai'}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-emerald-700">Thời gian tạo:</span>
                                            <span className="text-xs font-semibold text-emerald-900">
                                                {new Date(selectedImport.import.createdAt).toLocaleString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-emerald-200/50">
                                            <span className="font-bold text-emerald-800">Tổng thanh toán:</span>
                                            <span className="text-xl font-black text-emerald-600">
                                                {selectedImport.import.totalPrice?.toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                    </div>

                                    {/* List */}
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                                            <FileBox className="w-4 h-4 text-gray-400" /> Danh sách đã nhập
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedImport.details?.map(d => (
                                                <div key={d._id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-xs">
                                                    <img 
                                                        src={d.productId?.image || 'https://placehold.co/100'} 
                                                        alt={d.productId?.name} 
                                                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-gray-900 text-sm truncate">{d.productId?.name}</p>
                                                        <p className="text-xs text-gray-500">SL: {d.quantity} | Giá: {d.price.toLocaleString('vi-VN')}đ</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <span className="font-bold text-emerald-600 text-sm">
                                                            {(d.quantity * d.price).toLocaleString('vi-VN')}đ
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="p-5 border-t border-gray-100 bg-gray-50 shrink-0">
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-bold justify-center rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminImports;
