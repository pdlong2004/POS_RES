import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import AdminLoading from '@/components/admin/shared/AdminLoading';
import { getLogsApi } from '@/service/staff.service';
import {
    History,
    Search,
    Filter,
    Clock,
    User,
    X,
    RefreshCw,
    Eye,
    Shield,
    Activity,
    Terminal,
    ChevronRight,
    Lock,
    Zap,
    Info,
    Fingerprint,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Pagination from '@/components/admin/shared/Pagination';
import { useToast } from '@/context/ToastContext';

const getActionBadge = (action) => {
    switch (action) {
        case 'CREATE':
            return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-100 dark:border-emerald-900/30';
        case 'UPDATE':
            return 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 border-orange-100 dark:border-orange-900/30';
        case 'DELETE':
            return 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-100 dark:border-rose-900/30';
        default:
            return 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700';
    }
};

const LogItem = React.memo(({ log, onSelect }) => {
    return (
        <div className="p-8 hover:bg-orange-50/30 dark:hover:bg-zinc-800/30 transition-all group flex items-center justify-between gap-8">
            <div className="flex items-start gap-8 min-w-0">
                <div
                    className={cn(
                        'mt-1 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 shrink-0 transition-transform group-hover:scale-105',
                        getActionBadge(log.action),
                    )}
                >
                    {log.action}
                </div>
                <div className="min-w-0">
                    <p className="text-base font-bold text-slate-500 dark:text-slate-300 leading-relaxed tracking-tight">
                        <span className="font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors uppercase">
                            {log.accountId?.name || 'Hệ thống'}
                        </span>
                        <span className="mx-2 opacity-60 dark:opacity-80 dark:text-slate-400 lowercase italic font-medium">vừa thực hiện</span>
                        <span className="font-black text-slate-900 dark:text-white italic uppercase underline decoration-orange-200 dark:decoration-orange-900 underline-offset-4">
                            {log.action === 'CREATE' ? 'khởi tạo' : log.action === 'UPDATE' ? 'cập nhật' : 'xóa bỏ'}
                        </span>
                        <span className="mx-2 opacity-60 dark:opacity-80 dark:text-slate-400 lowercase italic font-medium">trên thực thể</span>
                        <span className="font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest text-xs px-3 py-1 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                            {log.entity}
                        </span>
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-8 text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">
                        <span className="flex items-center gap-2.5">
                            <Clock size={14} className="text-orange-300" />{' '}
                            {new Date(log.createdAt).toLocaleString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-2.5">
                            <Fingerprint size={14} className="text-orange-300" /> UID:{' '}
                            <span className="text-slate-600 dark:text-slate-300">{log.accountId?._id?.slice(-8).toUpperCase()}</span>
                        </span>
                    </div>
                </div>
            </div>
            <button
                onClick={() => onSelect(log)}
                className="flex items-center gap-3 h-12 px-6 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-500 hover:border-orange-100 dark:hover:border-orange-900/50 hover:shadow-lg rounded-2xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest group/btn shrink-0"
            >
                <Eye size={16} /> Phân tích
                <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </div>
    );
});

const ActivityLogs = () => {
    const { toast } = useToast();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLog, setSelectedLog] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await getLogsApi();
            setLogs(res.data.data);
        } catch (error) {
            console.error('Failed to fetch logs', error);
            toast.error('Không thể trích xuất nhật ký hệ thống');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = React.useMemo(() => {
        if (!searchTerm.trim()) return logs;
        const query = searchTerm.toLowerCase();
        return logs.filter(
            (log) =>
                log.accountId?.name?.toLowerCase().includes(query) ||
                log.entity?.toLowerCase().includes(query) ||
                log.action?.toLowerCase().includes(query),
        );
    }, [logs, searchTerm]);

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <AdminLayout className="space-y-12">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shadow-xl shadow-orange-50/50 transition-transform hover:rotate-6">
                        <History size={40} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                            Nhật ký hệ thống
                        </h1>
                        <p className="text-slate-500 dark:text-slate-300 mt-1 font-bold italic text-sm">
                            Truy vết mọi thao tác và biến động dữ liệu trong thời gian thực tại Manwah.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <button
                        onClick={fetchLogs}
                        className="admin-btn-secondary w-14 h-14 flex items-center justify-center p-0 rounded-2xl shadow-sm hover:border-orange-100 transition-all"
                        title="Làm mới"
                    >
                        <RefreshCw size={20} className={cn(loading && 'animate-spin')} />
                    </button>
                    <div className="flex items-center gap-3 text-[10px] font-black text-white bg-orange-600 px-6 py-4 rounded-2xl shadow-xl shadow-orange-100 uppercase tracking-widest">
                        <Shield size={16} fill="currentColor" className="opacity-20" /> Bảo mật thực thể
                    </div>
                </div>
            </div>

            {/* FILTER BAR */}
            <div className="admin-card p-6 bg-white/50 border-white/40 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-500 group-focus-within:text-orange-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo nhân viên, đối tượng hoặc hành động..."
                        className="admin-input pl-14 h-14 bg-white/50 dark:bg-zinc-900/50 text-xs font-black uppercase tracking-widest"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* DATA LIST */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="admin-card bg-white/50 border-white/40 shadow-sm overflow-hidden rounded-[3rem]">
                    <div className="p-10 border-b border-slate-50 bg-slate-50/50 backdrop-blur-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-100">
                                <Terminal size={22} />
                            </div>
                            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                                Dòng thời gian sự kiện Manwah
                            </span>
                        </div>
                        <div className="px-5 py-2 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-full shadow-sm text-[9px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">
                            {filteredLogs.length} Records Found
                        </div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {loading ? (
                            <div className="p-40 text-center">
                                <div className="flex flex-col items-center gap-6">
                                    <RefreshCw size={48} className="text-orange-600 animate-spin" />
                                    <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                        Đang giải mã bản ghi thực thể...
                                    </p>
                                </div>
                            </div>
                        ) : filteredLogs.length === 0 ? (
                            <div className="p-40 text-center opacity-30">
                                <History size={64} strokeWidth={1} className="text-slate-300 mx-auto mb-6" />
                                <p className="text-[10px] font-black uppercase tracking-widest">
                                    Cơ sở dữ liệu nhật ký trống hoặc không có kết quả
                                </p>
                            </div>
                        ) : (
                            paginatedLogs.map((log) => <LogItem key={log._id} log={log} onSelect={setSelectedLog} />)
                        )}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredLogs.length}
                        itemsPerPage={itemsPerPage}
                        className="bg-white/30"
                    />
                </div>
            </div>

            {/* DETAIL MODAL */}
            {selectedLog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
                        onClick={() => setSelectedLog(null)}
                    />

                    <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-[3.5rem] shadow-[0_32px_120px_-20px_rgba(79,70,229,0.2)] overflow-hidden border border-white/40 dark:border-zinc-800/50 animate-in zoom-in-95 duration-500 relative z-10">
                        <div className="px-12 py-10 border-b border-slate-50 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50 flex justify-between items-center">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[2rem] bg-orange-600 border border-orange-700 flex items-center justify-center text-white shadow-xl shadow-orange-100">
                                    <Terminal size={28} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                                        Phân tích bản ghi
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-[0.2em] mt-1">
                                        Trích xuất dữ liệu thô từ hệ thống nhật ký
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="w-14 h-14 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100 rounded-2xl transition-all shadow-sm flex items-center justify-center group"
                            >
                                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        <div className="p-12 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                        Người vận hành
                                    </p>
                                    <div className="flex items-center gap-5 p-6 bg-slate-50 dark:bg-zinc-800/50 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-inner">
                                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-center text-orange-600 font-black text-xl shadow-sm">
                                            {selectedLog.accountId?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-lg">
                                                {selectedLog.accountId?.name || 'Hệ thống'}
                                            </p>
                                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 italic">
                                                {selectedLog.accountId?.email || 'INTERNAL_SYSTEM_PROCESS'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                        Siêu dữ liệu (Metadata)
                                    </p>
                                    <div className="p-6 bg-slate-50 dark:bg-zinc-800/50 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-inner space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                Thời điểm
                                            </span>
                                            <span className="text-xs font-black text-slate-900 dark:text-white">
                                                {new Date(selectedLog.createdAt).toLocaleString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-zinc-700/50 pt-3">
                                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                Địa chỉ IP
                                            </span>
                                            <span className="text-xs font-mono font-black text-orange-600 flex items-center gap-2">
                                                <Activity size={12} /> {selectedLog.ipAddress || '127.0.0.1'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                        Hành động định danh
                                    </p>
                                    <div
                                        className={cn(
                                            'p-6 rounded-[2.5rem] border-2 shadow-sm flex items-center gap-4',
                                            getActionBadge(selectedLog.action),
                                        )}
                                    >
                                        <Zap size={20} fill="currentColor" className="opacity-20" />
                                        <span className="font-black uppercase tracking-widest text-[11px]">
                                            {selectedLog.action} {selectedLog.entity}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                        Thực thể UID
                                    </p>
                                    <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-between">
                                        <Lock size={18} className="text-orange-400" />
                                        <p className="text-xs font-mono font-black tracking-widest">
                                            {selectedLog.entityId || 'SYS_NULL_OBJECT'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between pl-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Payload chi tiết (JSON Object)
                                    </p>
                                    <Info size={14} className="text-slate-300 dark:text-slate-600" />
                                </div>
                                <div className="bg-slate-50 dark:bg-zinc-800/50 p-10 rounded-[3rem] border border-slate-100 dark:border-zinc-800 shadow-inner max-h-[350px] overflow-auto scrollbar-hide">
                                    {selectedLog.details && typeof selectedLog.details === 'object' ? (
                                        <div className="space-y-6">
                                            {Object.entries(selectedLog.details).map(([key, value]) => {
                                                const labelMap = {
                                                    name: 'Tên đối tượng',
                                                    email: 'Email định danh',
                                                    phone: 'SĐT liên hệ',
                                                    roleId: 'Vai trò UID',
                                                    position: 'Vị trí công tác',
                                                    salary: 'Mức thù lao',
                                                    status: 'Trạng thái bản ghi',
                                                    password: 'Bảo mật mật khẩu',
                                                };

                                                const label = labelMap[key] || key;
                                                const displayValue =
                                                    typeof value === 'boolean'
                                                        ? value
                                                            ? 'ACTIVE'
                                                            : 'LOCKED'
                                                        : key === 'salary'
                                                          ? `${value?.toLocaleString()} VND`
                                                          : String(value);

                                                return (
                                                    <div
                                                        key={key}
                                                        className="flex items-center justify-between border-b border-slate-200/50 dark:border-zinc-700/50 pb-5 last:border-0 group"
                                                    >
                                                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-orange-600 transition-colors">
                                                            {label}
                                                        </span>
                                                        <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                                                            {key === 'password'
                                                                ? '•••••••• (Encrypted Hash)'
                                                                : displayValue}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="h-24 flex flex-col items-center justify-center opacity-20">
                                            <Terminal size={32} className="mb-3" />
                                            <p className="text-[10px] font-black uppercase tracking-widest italic">
                                                Hành động này không mang theo dữ liệu mở rộng.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="px-12 py-10 bg-slate-50/50 border-t border-slate-50 flex justify-end">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="h-16 px-12 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all active:scale-95 hover:bg-slate-800"
                            >
                                Kết thúc phân tích
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ActivityLogs;
