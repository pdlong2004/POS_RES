import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import AdminLoading from '@/components/admin/shared/AdminLoading';
import { getTablesApi, createTableApi, updateTableStatusApi } from '@/service/table.service';
import { getStatusTablesApi } from '@/service/statusTable.service';
import { Plus, Loader2, X, RefreshCw, LayoutGrid, Info, CheckCircle2, AlertCircle, Clock, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

const AdminTables = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const roleName = (user?.roleId?.name || user?.role || '').toString().toLowerCase();
    const isAdmin = roleName === 'admin';

    const [tables, setTables] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTableName, setNewTableName] = useState('');
    const [creating, setCreating] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tRes, sRes] = await Promise.all([getTablesApi(), getStatusTablesApi()]);
            setTables(tRes?.data || []);
            setStatuses(sRes?.data || []);
        } catch (err) {
            console.error('Failed to load tables or statuses', err);
            toast.error('Không thể tải dữ liệu sơ đồ bàn');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async () => {
        if (!newTableName) return;
        setCreating(true);
        try {
            await createTableApi({ 
                name: newTableName, 
                direction: newTableName.toLowerCase().replace(/\s+/g, '-') 
            });
            setNewTableName('');
            toast.success(`Đã khởi tạo bàn ${newTableName} thành công`);
            await fetchData();
        } catch (err) {
            console.error('Create table failed', err);
            const msg = err.response?.data?.message || 'Khởi tạo bàn thất bại';
            toast.error(msg);
        } finally {
            setCreating(false);
        }
    };

    const changeStatus = async (tableId, statusId, tableName) => {
        try {
            await updateTableStatusApi(tableId, statusId);
            const statusName = statuses.find(s => s._id === statusId)?.name || 'mới';
            toast.success(`Đã cập nhật ${tableName} sang trạng thái ${statusName}`);
            await fetchData();
        } catch (err) {
            console.error('Update status failed', err);
            toast.error('Cập nhật trạng thái thất bại');
        }
    };

    const getStatusStyles = (statusName) => {
        if (!statusName) return 'bg-slate-50 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-zinc-700';
        const name = statusName.toLowerCase();
        if (name.includes('available') || name.includes('trống'))
            return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
        if (name.includes('occupied') || name.includes('bận')) 
            return 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
        if (name.includes('reserved') || name.includes('đặt'))
            return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
        return 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/30';
    };

    const getStatusIcon = (statusName) => {
        const name = statusName?.toLowerCase() || '';
        if (name.includes('available') || name.includes('trống')) return CheckCircle2;
        if (name.includes('occupied') || name.includes('bận')) return AlertCircle;
        if (name.includes('reserved') || name.includes('đặt')) return Clock;
        return Info;
    };

    return (
        <AdminLayout className="space-y-12">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Quản lý sơ đồ bàn</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm italic">
                        Theo dõi sơ đồ bàn và cập nhật trạng thái phục vụ thời gian thực tại Manwah.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl flex items-center gap-3 shadow-sm">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Hệ thống Live</span>
                    </div>
                    <button 
                        onClick={fetchData} 
                        className="admin-btn-secondary w-14 h-14 flex items-center justify-center p-0 rounded-2xl dark:bg-zinc-900/50 dark:border-zinc-800" 
                        title="Làm mới"
                    >
                        <RefreshCw size={20} className={cn(loading && 'animate-spin')} />
                    </button>
                </div>
            </div>

            {/* CREATE SECTION */}
            {isAdmin && (
                <div className="admin-card p-10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 shadow-sm border-white/40 dark:border-zinc-800/50">
                    <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                        <Plus size={18} className="text-orange-600 dark:text-orange-500" /> Khởi tạo vị trí bàn mới
                    </h2>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 relative group">
                            <LayoutGrid className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 dark:text-slate-600 group-focus-within:text-orange-600 dark:group-focus-within:text-orange-500 transition-colors" />
                            <input
                                value={newTableName}
                                onChange={(e) => setNewTableName(e.target.value)}
                                placeholder="Nhập tên bàn (vd: Bàn 1, Bàn A, VIP 1)..."
                                onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                                className="w-full admin-input h-16 pl-16 font-black uppercase tracking-tight text-lg bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                            />
                        </div>
                        <button
                            onClick={handleCreate}
                            disabled={creating || !newTableName}
                            className="h-16 px-12 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-100 dark:shadow-none min-w-[220px] transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3"
                        >
                            {creating ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <Plus size={20} /> Tạo bàn mới
                                </>
                            )}
                        </button>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-6 font-bold italic flex items-center gap-2">
                        <Info size={14} className="text-orange-600 dark:text-orange-500" /> Mẹo: Hệ thống sẽ tự động ánh xạ URL định danh cho bàn dựa trên tên bạn nhập.
                    </p>
                </div>
            )}

            {/* STATISTICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                {[
                    { label: 'Tổng số bàn', value: tables.length, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/20' },
                    { label: 'Đang phục vụ', value: tables.filter(t => t.statusId?.name?.toLowerCase().includes('occupied') || t.statusId?.name?.toLowerCase().includes('bận')).length, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/20' },
                    { label: 'Bàn trống', value: tables.filter(t => t.statusId?.name?.toLowerCase().includes('available') || t.statusId?.name?.toLowerCase().includes('trống')).length, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
                ].map((s, i) => (
                    <div key={i} className="admin-card p-8 flex items-center justify-between shadow-sm bg-white/50 dark:bg-zinc-900/50 border-white/40 dark:border-zinc-800/50">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{s.value}</p>
                        </div>
                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", s.bg, s.color)}>
                            <LayoutGrid size={32} />
                        </div>
                    </div>
                ))}
            </div>

            {/* GRID SECTION */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                {loading ? (
                    <div className="py-40 flex flex-col items-center justify-center">
                        <RefreshCw size={48} className="text-orange-600 dark:text-orange-500 animate-spin mb-6" />
                        <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">
                            Đang ánh xạ sơ đồ bàn Manwah...
                        </p>
                    </div>
                ) : tables.length === 0 ? (
                    <div className="admin-card py-40 flex flex-col items-center justify-center bg-white/30 dark:bg-zinc-900/30 border-dashed border-2 border-slate-200 dark:border-zinc-800">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-zinc-800 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100 dark:border-zinc-800 shadow-inner">
                            <LayoutGrid size={48} className="text-slate-200 dark:text-zinc-700" />
                        </div>
                        <p className="text-slate-900 dark:text-white font-black text-xl uppercase tracking-widest">Chưa có bàn nào được cấu hình</p>
                        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mt-3 italic">
                            Sử dụng bảng điều khiển phía trên để thêm bàn đầu tiên vào hệ thống.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {tables.map((t) => {
                            const StatusIcon = getStatusIcon(t.statusId?.name);
                            return (
                                <div
                                    key={t._id}
                                    className="admin-card group hover:border-orange-200 dark:hover:border-orange-900 transition-all duration-700 overflow-hidden relative bg-white/50 dark:bg-zinc-900/50 shadow-sm border-white/40 dark:border-zinc-800/50"
                                >
                                    <div className="p-8 space-y-8">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-orange-600 dark:group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 shadow-sm">
                                                        <MapPin size={18} />
                                                    </div>
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors truncate uppercase">
                                                        {t.name}
                                                    </h3>
                                                </div>
                                                <p className="text-[10px] text-slate-300 dark:text-slate-600 font-black uppercase tracking-widest truncate flex items-center gap-2">
                                                    REF: <span className="text-slate-400 dark:text-slate-500">{t.direction}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className={cn(
                                            'flex items-center gap-3 px-5 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all duration-500',
                                            getStatusStyles(t.statusId?.name),
                                            'dark:bg-opacity-20 dark:border-opacity-30'
                                        )}>
                                            <StatusIcon size={16} />
                                            {t.statusId?.name || 'CHƯA XÁC ĐỊNH'}
                                        </div>

                                        {isAdmin && (
                                            <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-zinc-800">
                                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                    <RefreshCw size={12} className="text-orange-400 dark:text-orange-500" /> Cập nhật trạng thái
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={t.statusId?._id || ''}
                                                        onChange={(e) => changeStatus(t._id, e.target.value, t.name)}
                                                        className="w-full h-12 px-5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white cursor-pointer focus:border-orange-600 dark:focus:border-orange-500 focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/20 transition-all outline-hidden appearance-none"
                                                    >
                                                        <option value="" disabled className="dark:bg-zinc-900">-- Chọn trạng thái --</option>
                                                        {statuses.map((s) => (
                                                            <option key={s._id} value={s._id} className="dark:bg-zinc-900">{s.name}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <Plus size={14} className="rotate-45" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Glass reflection effect */}
                                    <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-orange-600/5 rounded-full blur-2xl group-hover:bg-orange-600/10 transition-all" />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminTables;
