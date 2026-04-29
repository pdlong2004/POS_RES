import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Camera,
    LayoutDashboard,
    Activity,
    Calendar,
    History,
    Settings,
    Key,
    Bell,
    CheckCircle,
    Briefcase,
    Clock,
    TrendingUp,
    Moon,
    LogOut,
    ChevronRight,
    Star,
    Award,
    Target,
    Zap,
    CheckCircle2,
    ShieldAlert,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

// --- MOCK DATA ---
const performanceData = [
    { name: 'T1', hours: 120 },
    { name: 'T2', hours: 150 },
    { name: 'T3', hours: 180 },
    { name: 'T4', hours: 140 },
    { name: 'T5', hours: 160 },
    { name: 'T6', hours: 175 },
];

const scheduleData = [
    { date: '21/04/2026', shift: 'Sáng (08:00 - 12:00)', role: 'Cashier', status: 'Hôm nay' },
    { date: '22/04/2026', shift: 'Chiều (12:00 - 18:00)', role: 'Cashier', status: 'Sắp tới' },
    { date: '23/04/2026', shift: 'Tối (18:00 - 22:00)', role: 'Cashier', status: 'Sắp tới' },
];

const activityLogs = [
    {
        id: 1,
        action: 'Đăng nhập vào hệ thống',
        time: '10:20 - Hôm nay',
        icon: LogOut,
        color: 'text-orange-500 bg-orange-50',
    },
    {
        id: 2,
        action: 'Tạo đơn hàng #ORD-1234',
        time: '09:45 - Hôm nay',
        icon: CheckCircle2,
        color: 'text-emerald-500 bg-emerald-50',
    },
    {
        id: 3,
        action: 'Cập nhật thông tin cá nhân',
        time: 'Hôm qua',
        icon: User,
        color: 'text-orange-500 bg-orange-50',
    },
];

// --- SUB-COMPONENTS ---
const TabItem = ({ active, icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            'w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group',
            active
                ? 'bg-orange-600 text-white shadow-xl shadow-orange-100'
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50',
        )}
    >
        <div className="flex items-center gap-4">
            <Icon size={20} className={cn('transition-transform duration-500', active && 'scale-110')} />
            <span className="font-black text-xs uppercase tracking-widest">{label}</span>
        </div>
        {active && <ChevronRight size={16} className="opacity-50" />}
    </button>
);

const OverviewTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
                { label: 'Giờ làm tháng này', value: '160h', icon: Clock, color: 'text-sky-600', bg: 'bg-sky-50' },
                { label: 'Tổng ca làm', value: '24', icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'Hiệu suất', value: '98%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((stat, i) => (
                <div
                    key={i}
                    className="admin-card p-8 group hover:border-orange-200 transition-all duration-500 shadow-sm"
                >
                    <div className="flex items-center gap-6">
                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500", stat.bg)}>
                            <stat.icon size={28} className={stat.color} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                {stat.label}
                            </p>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="admin-card p-8 bg-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <Activity size={18} className="text-orange-600" /> Biểu đồ hoạt động
                </h4>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-600 shadow-lg shadow-orange-100" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Giờ làm việc (Hours)
                    </span>
                </div>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                        <defs>
                            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '16px',
                                padding: '12px',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            }}
                            itemStyle={{ color: '#1e293b', fontSize: '12px', fontWeight: 900 }}
                            labelStyle={{
                                color: '#94a3b8',
                                fontSize: '10px',
                                marginBottom: '4px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontWeight: 900
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="hours"
                            stroke="#ea580c"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorHours)"
                            dot={{ r: 6, fill: '#ea580c', strokeWidth: 3, stroke: '#ffffff' }}
                            activeDot={{ r: 8, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="admin-card p-8 bg-white/50 space-y-6 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                    <Award size={18} className="text-orange-600" /> Thành tích cá nhân
                </h4>
                <div className="space-y-4">
                    {[
                        { label: 'Nhân viên xuất sắc', date: 'Tháng 03/2026', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
                        { label: 'Hoàn thành 100+ ca', date: 'Phần thưởng đồng', icon: Target, color: 'text-sky-500', bg: 'bg-sky-50' },
                    ].map((badge, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-2xl group hover:border-orange-200 transition-all"
                        >
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border border-slate-50 shadow-sm group-hover:scale-110 transition-transform", badge.bg)}>
                                <badge.icon size={20} className={badge.color} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{badge.label}</p>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                                    {badge.date}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="admin-card p-8 bg-white/50 space-y-6 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                    <Zap size={18} className="text-orange-600" /> Kỹ năng chuyên môn
                </h4>
                <div className="space-y-6">
                    {[
                        { label: 'Quản lý kho', level: '90%', color: 'bg-emerald-500' },
                        { label: 'Dịch vụ khách hàng', level: '95%', color: 'bg-sky-500' },
                        { label: 'Vận hành POS', level: '100%', color: 'bg-orange-600' },
                    ].map((skill, i) => (
                        <div key={i} className="space-y-3">
                            <div className="flex justify-between items-end">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {skill.label}
                                </p>
                                <p className="text-xs font-black text-slate-900">{skill.level}</p>
                            </div>
                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <div
                                    className={cn('h-full transition-all duration-1000 shadow-sm', skill.color)}
                                    style={{ width: skill.level }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const PersonalInfoTab = ({ user }) => {
    const { toast } = useToast();
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="admin-card p-10 bg-white/50 space-y-10 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                            Họ và tên nhân sự
                        </label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 transition-colors" />
                            <input
                                defaultValue={user?.name || 'NGUYỄN VĂN A'}
                                className="admin-input h-14 pl-14 font-black uppercase tracking-tight"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                            Email định danh
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 transition-colors" />
                            <input
                                defaultValue={user?.email || 'admin@manwah.com'}
                                className="admin-input h-14 pl-14 font-black"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                            Số điện thoại
                        </label>
                        <div className="relative group">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 transition-colors" />
                            <input defaultValue={user?.phone || '0123456789'} className="admin-input h-14 pl-14 font-black tabular-nums" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                            Địa chỉ liên lạc
                        </label>
                        <div className="relative group">
                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 transition-colors" />
                            <input
                                defaultValue={'123 Đường Số 1, Quận 1, TP.HCM'}
                                className="admin-input h-14 pl-14 font-black"
                            />
                        </div>
                    </div>
                    <div className="space-y-3 opacity-60">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                            Ngày gia nhập hệ thống
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                            <input
                                defaultValue="01/01/2024"
                                readOnly
                                className="admin-input pl-14 h-14 bg-slate-50/50 cursor-not-allowed font-black tabular-nums"
                            />
                        </div>
                    </div>
                    <div className="space-y-3 opacity-60">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                            Vai trò vận hành
                        </label>
                        <div className="relative">
                            <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                            <input
                                defaultValue="QUẢN TRỊ VIÊN CẤP CAO"
                                readOnly
                                className="admin-input pl-14 h-14 bg-slate-50/50 cursor-not-allowed font-black uppercase tracking-widest"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pt-10 border-t border-slate-50">
                    <button
                        onClick={() => toast.success('Đã cập nhật hồ sơ cá nhân')}
                        className="h-14 px-12 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 transition-all active:scale-95 flex items-center gap-3"
                    >
                        <CheckCircle size={18} /> Lưu thay đổi hồ sơ
                    </button>
                </div>
            </div>
        </div>
    );
};

const ScheduleTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="admin-card p-0 border-white/40 overflow-hidden rounded-[2.5rem] shadow-sm bg-white/50">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ngày làm việc</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Khung giờ / Ca làm</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vị trí đảm nhiệm</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {scheduleData.map((s, i) => (
                            <tr key={i} className={cn('group transition-colors hover:bg-orange-50/30', s.status === 'Hôm nay' && 'bg-orange-50/20')}>
                                <td className="px-8 py-6 font-black text-slate-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight tabular-nums">
                                    {s.date}
                                </td>
                                <td className="px-8 py-6 text-slate-500 font-bold italic">{s.shift}</td>
                                <td className="px-8 py-6">
                                    <span className="inline-flex items-center px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:border-orange-100 group-hover:text-orange-600 transition-all shadow-sm">
                                        <Briefcase size={10} className="mr-2" /> {s.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <span
                                        className={cn(
                                            'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border',
                                            s.status === 'Hôm nay'
                                                ? 'bg-orange-600 text-white border-orange-600 animate-pulse'
                                                : 'bg-slate-50 text-slate-400 border-slate-100',
                                        )}
                                    >
                                        {s.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const ActivityLogTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="admin-card p-10 bg-white/50 shadow-sm">
            <div className="relative border-l-2 border-slate-100 ml-6 space-y-12 pb-4">
                {activityLogs.map((log) => (
                    <div key={log.id} className="relative pl-12 group">
                        <div
                            className={cn(
                                'absolute -left-[25px] top-0 w-12 h-12 rounded-2xl border-4 border-white flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm',
                                log.color,
                            )}
                        >
                            <log.icon size={20} />
                        </div>
                        <div className="bg-white border border-slate-100 p-8 rounded-3xl group-hover:border-orange-200 group-hover:shadow-lg group-hover:shadow-orange-100 transition-all duration-500">
                            <p className="font-black text-slate-900 text-lg tracking-tight uppercase">{log.action}</p>
                            <div className="flex items-center gap-3 mt-4 text-slate-400">
                                <Clock size={16} className="text-orange-600" />
                                <p className="text-[10px] font-black uppercase tracking-widest">{log.time}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const SecurityTab = () => {
    const { toast } = useToast();
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid gap-10 lg:grid-cols-2">
                <div className="admin-card p-10 bg-white/50 space-y-8 group hover:border-orange-200 transition-all duration-500 shadow-sm">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100 transition-transform duration-500 group-hover:scale-110">
                            <Key size={24} />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">Đổi mật khẩu</h4>
                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">Access Security</p>
                        </div>
                    </div>
                    <div className="space-y-5">
                        <input
                            type="password"
                            placeholder="Mật khẩu hiện tại"
                            className="admin-input h-14 font-black"
                        />
                        <input type="password" placeholder="Mật khẩu mới" className="admin-input h-14 font-black" />
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu mới"
                            className="admin-input h-14 font-black"
                        />
                        <button
                            onClick={() => toast.success('Đã cập nhật mật khẩu hệ thống')}
                            className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-100 mt-4 transition-all active:scale-95"
                        >
                            Cập nhật bảo mật
                        </button>
                    </div>
                </div>

                <div className="admin-card p-10 bg-white/50 space-y-8 group hover:border-orange-200 transition-all duration-500 shadow-sm">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 transition-transform duration-500 group-hover:scale-110">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">Xác thực 2 yếu tố</h4>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Multi-Factor Auth</p>
                        </div>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed font-bold italic">
                        Tăng cường bảo mật cho tài khoản của bạn bằng cách yêu cầu mã xác thực từ ứng dụng Authenticator
                        khi đăng nhập vào hệ thống quản trị Manwah POS.
                    </p>
                    <div className="flex items-center justify-between p-8 rounded-3xl bg-white border border-slate-100 mt-6 shadow-sm">
                        <span className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em]">
                            Trạng thái 2FA
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-16 h-9 bg-slate-100 rounded-full peer peer-checked:after:translate-x-[28px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-200 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-orange-600 shadow-inner"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsTab = () => {
    const { toast } = useToast();
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-6">
                {[
                    {
                        label: 'Chế độ tối (Dark Mode)',
                        desc: 'Giao diện tối giúp tập trung và giảm mỏi mắt',
                        icon: Moon,
                        active: false,
                    },
                    {
                        label: 'Thông báo hệ thống',
                        desc: 'Nhận cảnh báo đơn hàng & tồn kho mới tức thì',
                        icon: Bell,
                        active: true,
                    },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between p-10 rounded-[2.5rem] border border-slate-100 bg-white/50 group hover:border-orange-200 transition-all duration-500 shadow-sm"
                    >
                        <div className="flex items-center gap-8">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                <item.icon size={28} />
                            </div>
                            <div>
                                <p className="text-xl font-black text-slate-900 tracking-tight uppercase">{item.label}</p>
                                <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-1 italic">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                defaultChecked={item.active}
                                className="sr-only peer"
                                onChange={() => toast.success(`Đã cập nhật: ${item.label}`)}
                            />
                            <div className="w-16 h-9 bg-slate-100 rounded-full peer peer-checked:after:translate-x-[28px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-200 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-orange-600 shadow-inner"></div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const AdminProfile = () => {
    const { user, roleName } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [isAnimating, setIsAnimating] = useState(false);

    const handleTabChange = (tabId) => {
        if (tabId === activeTab) return;
        setIsAnimating(true);
        setTimeout(() => {
            setActiveTab(tabId);
            setIsAnimating(false);
        }, 250);
    };

    return (
        <AdminLayout className="space-y-12">
            {/* HERO HEADER */}
            <div className="relative rounded-[3.5rem] bg-white border border-white/40 shadow-2xl shadow-orange-100 overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-orange-600/5 to-transparent opacity-50" />
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px]" />

                <div className="h-64 md:h-80 w-full relative overflow-hidden group">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                        alt="Cover"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-20"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-white via-white/50 to-transparent" />
                </div>

                <div className="px-12 pb-16 relative z-10 -mt-32">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-12">
                        <div className="relative group">
                            <div className="w-48 h-48 md:w-56 md:h-56 rounded-[3rem] border-[12px] border-white bg-orange-600 flex items-center justify-center text-white text-7xl font-black shadow-2xl transition-all duration-700 group-hover:rounded-2xl group-hover:rotate-3 overflow-hidden">
                                {user?.image ? (
                                    <img src={user.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name ? user.name.charAt(0).toUpperCase() : 'A'
                                )}
                            </div>
                            <button className="absolute bottom-6 right-6 p-4 bg-white border border-slate-100 rounded-2xl shadow-2xl text-orange-600 hover:bg-orange-600 hover:text-white transition-all hover:scale-110 active:scale-95 group-hover:-translate-y-2">
                                <Camera size={24} />
                            </button>
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div>
                                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase">
                                    {user?.name || user?.username || 'QUẢN TRỊ VIÊN'}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 mt-6">
                                    <span className="px-6 py-2.5 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-lg shadow-orange-100">
                                        <Shield size={14} /> {roleName || 'System Admin'}
                                    </span>
                                    <span className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-6 py-2.5 rounded-2xl border border-slate-100">
                                        <MapPin size={14} className="text-orange-600" /> Hồ Chí Minh, Việt Nam
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleTabChange('personal')}
                            className="h-16 px-12 bg-white border border-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-3 group"
                        >
                            <span>Hiệu chỉnh Profile</span>
                            <ChevronRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform text-orange-600"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* CONTENT LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* NAVIGATION */}
                <div className="lg:col-span-3 space-y-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
                    <div className="admin-card p-4 border-white/40 shadow-sm bg-white/50 backdrop-blur-xl flex flex-col gap-2 sticky top-8 rounded-[2.5rem]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-6 py-4 mt-2">
                            Menu điều hướng
                        </p>
                        <TabItem
                            active={activeTab === 'overview'}
                            icon={LayoutDashboard}
                            label="Tổng quan"
                            onClick={() => handleTabChange('overview')}
                        />
                        <TabItem
                            active={activeTab === 'personal'}
                            icon={User}
                            label="Thông tin cá nhân"
                            onClick={() => handleTabChange('personal')}
                        />
                        <TabItem
                            active={activeTab === 'schedule'}
                            icon={Calendar}
                            label="Lịch làm việc"
                            onClick={() => handleTabChange('schedule')}
                        />
                        <TabItem
                            active={activeTab === 'activity'}
                            icon={History}
                            label="Lịch sử hoạt động"
                            onClick={() => handleTabChange('activity')}
                        />
                        <div className="h-px bg-slate-100 my-4 mx-6"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-6 py-4">
                            Security & Settings
                        </p>
                        <TabItem
                            active={activeTab === 'security'}
                            icon={ShieldAlert}
                            label="Bảo mật tài khoản"
                            onClick={() => handleTabChange('security')}
                        />
                        <TabItem
                            active={activeTab === 'settings'}
                            icon={Settings}
                            label="Cài đặt hệ thống"
                            onClick={() => handleTabChange('settings')}
                        />
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="lg:col-span-9 min-h-[700px] animate-in fade-in slide-in-from-right-4 duration-700 delay-500">
                    <div
                        className={cn(
                            'transition-all duration-500 ease-out',
                            isAnimating
                                ? 'opacity-0 translate-y-8 scale-95'
                                : 'opacity-100 translate-y-0 scale-100',
                        )}
                    >
                        {activeTab === 'overview' && <OverviewTab />}
                        {activeTab === 'personal' && <PersonalInfoTab user={user} />}
                        {activeTab === 'schedule' && <ScheduleTab />}
                        {activeTab === 'activity' && <ActivityLogTab />}
                        {activeTab === 'security' && <SecurityTab />}
                        {activeTab === 'settings' && <SettingsTab />}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProfile;

