import React, { useEffect, useState } from 'react';
import SidebarAdmin from '@/components/admin/shared/SidebarAdmin';
import HeaderAdmin from '@/components/admin/shared/HeaderAdmin';
import { getTablesApi, createTableApi, updateTableStatusApi } from '@/service/table.service';
import { getStatusTablesApi } from '@/service/statusTable.service';
import { Plus, Loader2 } from 'lucide-react';

const AdminTables = () => {
    const [tables, setTables] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTableName, setNewTableName] = useState('');
    const [creating, setCreating] = useState(false);

    const fetch = async () => {
        setLoading(true);
        try {
            const t = await getTablesApi();
            setTables(t?.data || []);
            const s = await getStatusTablesApi();
            setStatuses(s?.data || []);
        } catch (err) {
            console.error('Failed to load tables or statuses', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const handleCreate = async () => {
        if (!newTableName) return;
        setCreating(true);
        try {
            await createTableApi({ name: newTableName, direction: newTableName.toLowerCase().replace(/\s+/g, '-') });
            setNewTableName('');
            await fetch();
        } catch (err) {
            console.error('Create table failed', err);
        } finally {
            setCreating(false);
        }
    };

    const changeStatus = async (tableId, statusId) => {
        try {
            await updateTableStatusApi(tableId, statusId);
            await fetch();
        } catch (err) {
            console.error('Update status failed', err);
        }
    };

    const getStatusColor = (statusName) => {
        if (!statusName) return 'bg-gray-100 text-gray-800';
        const name = statusName.toLowerCase();
        if (name.includes('available') || name.includes('trống')) return 'bg-emerald-100 text-emerald-800';
        if (name.includes('occupied') || name.includes('bận')) return 'bg-rose-100 text-rose-800';
        if (name.includes('reserved') || name.includes('đặt')) return 'bg-amber-100 text-amber-800';
        return 'bg-slate-100 text-slate-800';
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
            <HeaderAdmin />

            <div className="flex">
                <SidebarAdmin />

                <main className="flex-1 container mx-auto px-6 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Quản lý bàn</h1>
                        <p className="text-slate-600">Quản lý và theo dõi trạng thái các bàn tại nhà hàng</p>
                    </div>

                    {/* Create Table Section */}
                    <div className="mb-8 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Thêm bàn mới</h2>
                        <div className="flex gap-3">
                            <input
                                value={newTableName}
                                onChange={(e) => setNewTableName(e.target.value)}
                                placeholder="Nhập tên bàn (vd: Bàn 1, Bàn A)"
                                onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-500"
                            />
                            <button
                                onClick={handleCreate}
                                disabled={creating || !newTableName}
                                className="px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                            >
                                {creating ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Đang tạo...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        Tạo bàn
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Tables Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <Loader2 className="mx-auto mb-4 text-orange-500 animate-spin" size={32} />
                                <p className="text-slate-600">Đang tải danh sách bàn...</p>
                            </div>
                        </div>
                    ) : tables.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
                            <p className="text-slate-600 text-lg">Chưa có bàn nào</p>
                            <p className="text-slate-500 text-sm mt-1">Hãy thêm bàn mới để bắt đầu</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tables.map((t) => (
                                <div
                                    key={t._id}
                                    className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-slate-900">{t.name}</h3>
                                                <p className="text-sm text-slate-500 mt-1">{t.direction}</p>
                                            </div>
                                            {t.statusId?.name && (
                                                <div
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(t.statusId.name)} ml-2 whitespace-nowrap`}
                                                >
                                                    {t.statusId.name}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Đổi trạng thái
                                            </label>
                                            <select
                                                value={t.statusId?._id || ''}
                                                onChange={(e) => changeStatus(t._id, e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-slate-900 text-sm"
                                            >
                                                <option value="">-- Chọn trạng thái --</option>
                                                {statuses.map((s) => (
                                                    <option key={s._id} value={s._id}>
                                                        {s.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminTables;
