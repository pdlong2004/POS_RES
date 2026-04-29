import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import {
    createRoleApi,
    deleteRoleApi,
    getAllPermissionsApi,
    getRolePermissionsApi,
    getRolesApi,
    setRolePermissionsApi,
    upsertPermissionApi,
} from '@/service/role.service';
import { 
    ShieldCheck, 
    ShieldAlert, 
    Plus, 
    RefreshCw, 
    Trash2, 
    Save, 
    Lock, 
    Shield, 
    Key, 
    Search, 
    ChevronRight,
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

const Roles = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [checked, setChecked] = useState(new Set());
    const [newRoleName, setNewRoleName] = useState('');
    const [newPermCode, setNewPermCode] = useState('');
    const [newPermDesc, setNewPermDesc] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const selectedRole = useMemo(() => roles.find((r) => r._id === selectedRoleId) || null, [roles, selectedRoleId]);

    const filteredPermissions = useMemo(() => {
        return permissions.filter(p => 
            p.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [permissions, searchTerm]);

    const refresh = async () => {
        setLoading(true);
        try {
            const [rRes, pRes] = await Promise.all([getRolesApi(), getAllPermissionsApi()]);
            const roleData = rRes.data?.data || [];
            const permData = pRes.data?.data || [];
            setRoles(roleData);
            setPermissions(permData);
            if (!selectedRoleId && roleData.length > 0) setSelectedRoleId(roleData[0]._id);
        } catch (e) {
            toast.error(e?.response?.data?.message || 'Không tải được dữ liệu phân quyền');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        const loadRolePerms = async () => {
            if (!selectedRoleId) return;
            try {
                const res = await getRolePermissionsApi(selectedRoleId);
                const ids = res.data?.data?.permissionIds || [];
                setChecked(new Set(ids.map(String)));
            } catch (e) {
                toast.error(e?.response?.data?.message || 'Không tải được quyền của role');
            }
        };
        loadRolePerms();
    }, [selectedRoleId]);

    const toggle = (permissionId) => {
        setChecked((prev) => {
            const next = new Set(prev);
            const key = String(permissionId);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const save = async () => {
        if (!selectedRoleId) return;
        setSaving(true);
        try {
            await setRolePermissionsApi(selectedRoleId, { permissionIds: Array.from(checked) });
            toast.success(`Đã cập nhật quyền cho nhóm ${selectedRole?.name}`);
        } catch (e) {
            toast.error(e?.response?.data?.message || 'Lưu phân quyền thất bại');
        } finally {
            setSaving(false);
        }
    };

    const createRole = async () => {
        const name = newRoleName.trim();
        if (!name) return;
        try {
            const res = await createRoleApi({ name });
            const created = res.data?.data;
            toast.success(`Đã khởi tạo vai trò ${name}`);
            await refresh();
            if (created?._id) setSelectedRoleId(created._id);
            setNewRoleName('');
        } catch (e) {
            toast.error(e?.response?.data?.message || 'Tạo role thất bại');
        }
    };

    const createPermission = async () => {
        const code = newPermCode.trim();
        if (!code) return;
        try {
            await upsertPermissionApi({ code, description: newPermDesc });
            toast.success(`Đã tạo định danh quyền ${code}`);
            setNewPermCode('');
            setNewPermDesc('');
            await refresh();
        } catch (e) {
            toast.error(e?.response?.data?.message || 'Tạo permission thất bại');
        }
    };

    const deleteRole = async () => {
        if (!selectedRoleId) return;
        if (!confirm(`Bạn có chắc chắn muốn xóa vai trò "${selectedRole?.name}"?`)) return;
        try {
            await deleteRoleApi(selectedRoleId);
            toast.success('Đã gỡ bỏ vai trò khỏi hệ thống');
            setSelectedRoleId('');
            setChecked(new Set());
            await refresh();
        } catch (e) {
            toast.error(e?.response?.data?.message || 'Xóa role thất bại');
        }
    };

    return (
        <AdminLayout className="space-y-12">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Ma trận phân quyền</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm italic">
                        Cấu hình vai trò và quản lý quyền truy cập tài nguyên hệ thống Manwah.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={refresh}
                        className="admin-btn-secondary w-14 h-14 flex items-center justify-center p-0 rounded-2xl dark:bg-zinc-900/50 dark:border-zinc-800"
                        title="Tải lại"
                    >
                        <RefreshCw size={20} className={cn(loading && 'animate-spin')} />
                    </button>
                    <button
                        onClick={save}
                        disabled={loading || saving || !selectedRoleId}
                        className="h-14 px-8 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                    >
                        {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? 'Đang thực thi...' : 'Lưu cấu hình'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* LEFT SIDE: ROLES MANAGEMENT */}
                <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                    <div className="admin-card p-8 bg-white/50 dark:bg-zinc-900/50 shadow-sm border-white/40 dark:border-zinc-800/50">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-sm dark:shadow-none">
                                <Shield size={20} />
                            </div>
                            <h2 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Danh mục vai trò</h2>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Chọn vai trò cấu hình</label>
                            <div className="space-y-2">
                                {roles.map((r) => (
                                    <button
                                        key={r._id}
                                        onClick={() => setSelectedRoleId(r._id)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group",
                                            selectedRoleId === r._id 
                                                ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100 dark:shadow-none" 
                                                : "bg-white dark:bg-zinc-900 border-slate-50 dark:border-zinc-800 text-slate-900 dark:text-white hover:border-orange-100 dark:hover:border-orange-900"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                                                selectedRoleId === r._id ? "bg-white/20" : "bg-slate-50 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/30 group-hover:text-orange-600 dark:group-hover:text-orange-500"
                                            )}>
                                                <Key size={14} />
                                            </div>
                                            <span className="font-black text-[11px] uppercase tracking-widest">{r.name}</span>
                                        </div>
                                        <ChevronRight size={16} className={cn(selectedRoleId === r._id ? "opacity-100" : "opacity-0 group-hover:opacity-40")} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-10 pt-10 border-t border-slate-50 dark:border-zinc-800 space-y-6">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Khởi tạo vai trò mới</p>
                            <div className="flex gap-3">
                                <input
                                    value={newRoleName}
                                    onChange={(e) => setNewRoleName(e.target.value)}
                                    placeholder="Vd: Quản lý, Giám sát..."
                                    className="flex-1 admin-input h-14 font-black uppercase text-[10px] tracking-widest bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                                    disabled={loading}
                                />
                                <button 
                                    onClick={createRole} 
                                    disabled={loading || !newRoleName.trim()}
                                    className="w-14 h-14 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center border border-orange-100 dark:border-orange-900/30 hover:bg-orange-600 dark:hover:bg-orange-500 hover:text-white transition-all shadow-sm dark:shadow-none"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            <button
                                onClick={deleteRole}
                                disabled={loading || !selectedRoleId}
                                className="w-full h-14 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest border border-rose-100 dark:border-rose-900/30 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-all shadow-sm dark:shadow-none"
                            >
                                <Trash2 size={16} /> Gỡ bỏ vai trò
                            </button>
                        </div>
                    </div>
                    
                    <div className="admin-card p-6 bg-slate-900 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="flex items-center gap-4 mb-4 relative z-10">
                            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                <Info size={18} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Security Advisory</p>
                        </div>
                        <p className="text-[11px] font-bold leading-relaxed relative z-10 italic">
                            Hệ thống sử dụng cơ chế RBAC (Role-Based Access Control). Mọi thay đổi về quyền sẽ có hiệu lực ngay lập tức khi nhân viên đăng nhập lại.
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE: PERMISSIONS MANAGEMENT */}
                <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                    <div className="admin-card p-10 bg-white/50 dark:bg-zinc-900/50 shadow-sm border-white/40 dark:border-zinc-800/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm dark:shadow-none">
                                    <Lock size={20} />
                                </div>
                                <div>
                                    <h2 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Danh mục quyền hạn</h2>
                                    {selectedRole && (
                                        <p className="text-[9px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest mt-1">Cấu hình cho: {selectedRole.name}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="relative group w-full md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm kiếm quyền hạn..."
                                    className="w-full admin-input h-11 pl-11 text-[10px] font-black uppercase tracking-widest bg-white/50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
                            {filteredPermissions.map((p) => (
                                <label
                                    key={p._id}
                                    className={cn(
                                        "flex items-start gap-4 p-5 rounded-[2rem] border transition-all duration-300 cursor-pointer group",
                                        checked.has(String(p._id)) 
                                            ? "bg-orange-50/50 dark:bg-orange-950/10 border-orange-100 dark:border-orange-900/30 shadow-sm dark:shadow-none" 
                                            : "bg-white dark:bg-zinc-900 border-slate-50 dark:border-zinc-800 hover:border-orange-50 dark:hover:border-orange-900"
                                    )}
                                >
                                    <div className="pt-1">
                                        <div className={cn(
                                            "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                            checked.has(String(p._id)) 
                                                ? "bg-orange-600 border-orange-600 shadow-lg shadow-orange-100 dark:shadow-none" 
                                                : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 group-hover:border-orange-400"
                                        )}>
                                            {checked.has(String(p._id)) && <Plus size={14} className="text-white rotate-45" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={checked.has(String(p._id))}
                                            onChange={() => toggle(p._id)}
                                            disabled={loading || !selectedRoleId}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className={cn(
                                                "text-[11px] font-black uppercase tracking-widest transition-colors",
                                                checked.has(String(p._id)) ? "text-orange-600 dark:text-orange-400" : "text-slate-900 dark:text-white"
                                            )}>{p.code}</span>
                                            {checked.has(String(p._id)) && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                                            )}
                                        </div>
                                        {p.description && (
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold italic tracking-tight">{p.description}</p>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>

                        {filteredPermissions.length === 0 && (
                            <div className="py-20 flex flex-col items-center justify-center opacity-30">
                                <ShieldAlert size={48} className="text-slate-400 mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Không tìm thấy quyền hạn phù hợp</p>
                            </div>
                        )}

                        <div className="mt-12 pt-10 border-t border-slate-50 dark:border-zinc-800 space-y-8">
                            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Khai báo quyền hạn mới</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1">
                                    <input
                                        value={newPermCode}
                                        onChange={(e) => setNewPermCode(e.target.value)}
                                        placeholder="Mã (vd: product:read)"
                                        className="w-full admin-input h-14 font-black uppercase text-[10px] tracking-widest bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <input
                                        value={newPermDesc}
                                        onChange={(e) => setNewPermDesc(e.target.value)}
                                        placeholder="Mô tả chức năng..."
                                        className="w-full admin-input h-14 font-black uppercase text-[10px] tracking-widest bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                                        disabled={loading}
                                    />
                                </div>
                                <button 
                                    onClick={createPermission} 
                                    disabled={loading || !newPermCode.trim()}
                                    className="h-14 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-all shadow-sm dark:shadow-none"
                                >
                                    <Plus size={16} className="text-orange-600 dark:text-orange-500" /> Khai báo quyền
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Roles;

