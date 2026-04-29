import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import AdminLoading from '@/components/admin/shared/AdminLoading';
import { getStaffApi, createStaffApi, updateStaffApi, deleteStaffApi } from '@/service/staff.service';
import { getRolesApi } from '@/service/role.service';
import {
    UserPlus,
    Search,
    Edit2,
    Trash2,
    Shield,
    Lock,
    Unlock,
    X,
    Loader2,
    Mail,
    Phone,
    Briefcase,
    DollarSign,
    RefreshCw,
    ChevronRight,
    User,
    CheckCircle2,
    ShieldAlert,
    Contact,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';
import Pagination from '@/components/admin/shared/Pagination';

const StaffManagement = () => {
    const { toast } = useToast();
    const [staff, setStaff] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        roleId: '',
        position: '',
        salary: '',
        status: true,
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const fetchData = async () => {
        setLoading(true);
        try {
            const [staffRes, rolesRes] = await Promise.all([getStaffApi(), getRolesApi()]);
            setStaff(staffRes.data.data);
            setRoles(rolesRes.data.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
            toast.error('Không thể tải dữ liệu nhân viên');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (s = null) => {
        if (s) {
            setEditingStaff(s);
            setFormData({
                name: s.name || '',
                email: s.email || '',
                phone: s.phone || '',
                roleId: s.roleId?._id || '',
                position: s.employeeInfo?.position || '',
                salary: s.employeeInfo?.salary || '',
                status: s.status ?? true,
            });
        } else {
            setEditingStaff(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: '',
                roleId: '',
                position: '',
                salary: '',
                status: true,
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingStaff) {
                await updateStaffApi(editingStaff._id, formData);
                toast.success('Cập nhật nhân viên thành công');
            } else {
                await createStaffApi(formData);
                toast.success('Thêm nhân viên mới thành công');
            }
            setShowModal(false);
            await fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
            try {
                await deleteStaffApi(id);
                toast.success('Đã xóa nhân viên');
                fetchData();
            } catch (error) {
                toast.error('Xóa thất bại');
            }
        }
    };

    const filteredStaff = staff.filter(
        (s) =>
            s.name?.toLowerCase().includes(search.toLowerCase()) ||
            s.email?.toLowerCase().includes(search.toLowerCase()),
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
    const paginatedStaff = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    return (
        <AdminLayout className="space-y-10">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Nhân sự hệ thống</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm italic">
                        Quản lý đội ngũ vận hành, hồ sơ nhân viên và phân quyền truy cập.
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <button
                        onClick={fetchData}
                        className="admin-btn-secondary w-12 h-12 flex items-center justify-center p-0 rounded-2xl dark:bg-zinc-900/50 dark:border-zinc-800"
                        title="Làm mới"
                    >
                        <RefreshCw size={18} className={cn(loading && 'animate-spin')} />
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex-1 lg:flex-none h-14 px-10 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg dark:shadow-none shadow-orange-100 transition-all flex items-center justify-center gap-3"
                    >
                        <UserPlus size={20} /> Thêm nhân sự
                    </button>
                </div>
            </div>

            {/* SEARCH BAR */}
            <div className="admin-card p-8 border-white/40 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-700 group-focus-within:text-orange-600 dark:group-focus-within:text-orange-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm nhân sự theo tên hoặc email định danh..."
                        className="admin-input pl-14 h-16 bg-white/50 dark:bg-zinc-900 border-white dark:border-zinc-800 font-bold text-slate-900 dark:text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* DATA TABLE */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="admin-card overflow-hidden border-white/40 dark:border-zinc-800/50 p-0 rounded-[2.5rem] bg-white/50 dark:bg-zinc-900/50">
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[300px]">Hồ sơ nhân viên</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Cấp bậc / Vai trò</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Định danh liên hệ</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Lương cơ bản</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Trạng thái</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6">
                                            <AdminLoading message="Đang truy xuất hồ sơ nhân sự..." />
                                        </td>
                                    </tr>
                                ) : filteredStaff.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-6">
                                                <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-200 dark:text-zinc-700">
                                                    <User size={40} strokeWidth={1} />
                                                </div>
                                                <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-xs">
                                                    Không tìm thấy hồ sơ nhân sự phù hợp
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedStaff.map((s) => (
                                        <tr key={s._id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 flex items-center justify-center font-black text-orange-600 dark:text-orange-400 shadow-sm group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                                                        {s.image ? (
                                                            <img src={s.image} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            s.name?.charAt(0)?.toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors truncate text-base tracking-tight uppercase">
                                                            {s.name}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Briefcase size={12} className="text-orange-400 dark:text-orange-600" />
                                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest italic">
                                                                {s.employeeInfo?.position || 'UNSET POSITION'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="inline-flex items-center px-3 py-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:border-orange-100 dark:group-hover:border-orange-900 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-all">
                                                    <Shield size={10} className="mr-2" />
                                                    {s.roleId?.name || 'GUEST ACCOUNT'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                                        <Mail size={12} className="text-orange-400 dark:text-orange-600" />
                                                        {s.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic tabular-nums">
                                                        <Phone size={12} className="text-orange-400 dark:text-orange-600" />
                                                        {s.phone || 'NO CONTACT'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-lg font-black text-emerald-600 dark:text-emerald-500 tabular-nums tracking-tighter">
                                                    {s.employeeInfo?.salary
                                                        ? `${s.employeeInfo.salary.toLocaleString()}đ`
                                                        : '---'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                {s.status ? (
                                                    <span className="inline-flex items-center px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                        <CheckCircle2 size={10} className="mr-1.5" /> Hoạt động
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                        <ShieldAlert size={10} className="mr-1.5" /> Đã khóa
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button
                                                        onClick={() => handleOpenModal(s)}
                                                        className="p-3 bg-white dark:bg-zinc-800 hover:bg-orange-600 text-slate-400 dark:text-slate-500 hover:text-white border border-slate-100 dark:border-zinc-700 rounded-xl transition-all shadow-sm group/btn"
                                                    >
                                                        <Edit2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(s._id)}
                                                        className="p-3 bg-white dark:bg-zinc-800 hover:bg-rose-600 text-slate-400 dark:text-slate-500 hover:text-white border border-slate-100 dark:border-zinc-700 rounded-xl transition-all shadow-sm group/btn"
                                                    >
                                                        <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredStaff.length}
                        itemsPerPage={itemsPerPage}
                        className="bg-white/30 dark:bg-zinc-900/30"
                    />
                </div>
            </div>

            {/* DRAWER MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white dark:border-zinc-800 animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                        <div className="p-10 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-800/50">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-orange-600 dark:bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-100 dark:shadow-none">
                                    <Contact size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                        {editingStaff ? 'Hiệu chỉnh hồ sơ' : 'Khởi tạo nhân sự'}
                                    </h2>
                                    <p className="text-orange-600 dark:text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                                        Human Capital Infrastructure
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide bg-white/50 dark:bg-zinc-900/50">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Họ và tên nhân sự <span className="text-rose-500">*</span></label>
                                    <input
                                        required
                                        placeholder="NGUYỄN VĂN A"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="admin-input h-14 font-black uppercase tracking-tight text-slate-900 dark:text-white bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Email định danh <span className="text-rose-500">*</span></label>
                                    <div className="relative group">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
                                        <input
                                            required
                                            type="email"
                                            placeholder="staff@manwah.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="admin-input h-14 pl-12 font-black text-slate-900 dark:text-white bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800"
                                        />
                                    </div>
                                </div>
                                {!editingStaff && (
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Mật khẩu truy cập <span className="text-rose-500">*</span></label>
                                        <div className="relative group">
                                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
                                            <input
                                                required
                                                type="password"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="admin-input h-14 pl-12 font-black text-slate-900 dark:text-white bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Hotline liên hệ</label>
                                    <div className="relative group">
                                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
                                        <input
                                            placeholder="0xxxxxxxxx"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="admin-input h-14 pl-12 font-black tabular-nums text-slate-900 dark:text-white bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Vai trò hệ thống <span className="text-rose-500">*</span></label>
                                    <select
                                        className="admin-input h-14 bg-white dark:bg-zinc-950 cursor-pointer font-black text-[11px] uppercase tracking-widest appearance-none text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                                        value={formData.roleId}
                                        onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                        required
                                    >
                                        <option value="" className="dark:bg-zinc-900">-- CHỌN QUYỀN HẠN --</option>
                                        {roles.map((r) => (
                                            <option key={r._id} value={r._id} className="dark:bg-zinc-900">
                                                {r.name.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Chức danh công tác</label>
                                    <input
                                        placeholder="MANAGER / CHEF / WAITER"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        className="admin-input h-14 font-black uppercase tracking-tight text-slate-900 dark:text-white bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Lương thỏa thuận (VNĐ)</label>
                                    <div className="relative group">
                                        <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
                                        <input
                                            type="number"
                                            placeholder="8.000.000"
                                            value={formData.salary}
                                            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                            className="admin-input h-14 pl-12 font-black text-emerald-600 dark:text-emerald-500 tabular-nums bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800"
                                        />
                                    </div>
                                </div>
                                {editingStaff && (
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Trạng thái vận hành</label>
                                        <select
                                            className="admin-input h-14 bg-white dark:bg-zinc-950 cursor-pointer font-black text-[11px] uppercase tracking-widest appearance-none text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                                            value={String(formData.status ?? true)}
                                            onChange={(e) =>
                                                setFormData({ ...formData, status: e.target.value === 'true' })
                                            }
                                        >
                                            <option value="true" className="dark:bg-zinc-900">ĐANG HOẠT ĐỘNG</option>
                                            <option value="false" className="dark:bg-zinc-900">TẠM KHÓA TÀI KHOẢN</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-[2.5rem] flex items-start gap-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center text-orange-600 dark:text-orange-500 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                    <Shield size={24} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-[0.2em]">
                                        Chính sách bảo mật nhân sự
                                    </p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-bold italic">
                                        Vui lòng đảm bảo email định danh là duy nhất. Mọi thay đổi về phân quyền sẽ có hiệu lực ngay sau khi nhân viên tái đăng nhập hệ thống.
                                    </p>
                                </div>
                            </div>
                        </form>

                        <div className="p-10 border-t border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 flex gap-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    disabled={isSubmitting}
                                    className="flex-1 h-16 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all active:scale-95"
                                >
                                    Hủy bỏ thao tác
                                </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-[2] h-16 rounded-2xl bg-orange-600 dark:bg-orange-500 text-white text-xs font-black uppercase tracking-widest hover:bg-orange-700 shadow-xl dark:shadow-none shadow-orange-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <CheckCircle2 size={20} /> {editingStaff ? 'Cập nhật hồ sơ nhân sự' : 'Xác thực khởi tạo nhân sự'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default StaffManagement;
