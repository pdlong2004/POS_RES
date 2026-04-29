import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import {
    Bell,
    Globe,
    Shield,
    Store,
    ChevronRight,
    RefreshCw,
    Save,
    Zap,
    Database,
    Cpu,
    Lock,
    Layout,
    Palette,
    CreditCard,
    Smartphone,
    Mail,
    HardDrive,
    Sun,
    Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';

const AdminSettings = () => {
    const { toast } = useToast();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('brand');

    const [settings, setSettings] = useState({
        storeName: 'MANWAH POS INTELLIGENCE',
        hotline: '028 1234 5678',
        address: '123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
        notifications: true,
        realtimeSync: true,
        twoFactor: false,
        cloudBackup: true,
    });

    useEffect(() => {
        const saved = localStorage.getItem('admin_settings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('admin_settings', JSON.stringify(settings));
        toast.success('Đã lưu tất cả thay đổi hệ thống');
    };

    const resetDefaults = () => {
        const defaults = {
            storeName: 'MANWAH POS INTELLIGENCE',
            hotline: '028 1234 5678',
            address: '123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
            notifications: true,
            realtimeSync: true,
            twoFactor: false,
            cloudBackup: true,
        };
        setSettings(defaults);
        toast.info('Đã khôi phục thiết lập mặc định');
    };

    return (
        <AdminLayout className="space-y-12">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                        Thiết lập hệ thống
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm italic">
                        Cấu hình tham số vận hành, bảo mật và giao diện quản trị tập trung.
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <button 
                        onClick={resetDefaults}
                        className="admin-btn-secondary h-14 px-8 flex items-center gap-2 rounded-2xl bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                    >
                        <RefreshCw size={18} /> Mặc định
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 lg:flex-none h-14 px-10 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 dark:shadow-none transition-all flex items-center justify-center gap-3"
                    >
                        <Save size={18} /> Lưu cấu hình
                    </button>
                </div>
            </div>

            {/* SETTINGS CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* NAVIGATION SIDER */}
                <div className="lg:col-span-3 space-y-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                    <div className="admin-card p-4 border-white/40 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-[2.5rem] shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-4 py-3">
                            Phân loại cài đặt
                        </p>
                        <div className="space-y-1.5">
                            {[
                                { id: 'brand', label: 'Thông tin cơ sở', icon: Store },
                                { id: 'notification', label: 'Thông báo', icon: Bell },
                                { id: 'security', label: 'Bảo mật', icon: Shield },
                                { id: 'appearance', label: 'Giao diện', icon: Palette },
                                { id: 'data', label: 'Dữ liệu', icon: Database },
                                { id: 'payment', label: 'Thanh toán', icon: CreditCard },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={cn(
                                        'w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-black text-xs uppercase tracking-widest',
                                        activeTab === item.id
                                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-100 dark:shadow-none'
                                            : 'text-slate-500 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-white dark:hover:bg-zinc-800',
                                    )}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SETTINGS FORM */}
                <div className="lg:col-span-9 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                    {activeTab === 'brand' && (
                        <div className="admin-card p-0 border-white/40 dark:border-zinc-800/50 overflow-hidden rounded-[2.5rem] shadow-sm bg-white/30 dark:bg-zinc-900/30">
                            <div className="p-10 border-b border-slate-50 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-800/20 flex items-center gap-6">
                                <div className="p-4 bg-orange-600 rounded-2xl shadow-lg shadow-orange-100 dark:shadow-none text-white">
                                    <Store className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                        Thông tin thương hiệu
                                    </h3>
                                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">
                                        Brand & Identity Infrastructure
                                    </p>
                                </div>
                            </div>

                            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest block px-1">
                                        Tên cửa hàng / Doanh nghiệp
                                    </label>
                                    <input
                                        value={settings.storeName}
                                        onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                                        className="admin-input h-16 font-black uppercase tracking-tight text-slate-900 dark:text-white bg-white dark:bg-zinc-900"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest block px-1">
                                        Hotline vận hành
                                    </label>
                                    <input
                                        value={settings.hotline}
                                        onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                                        className="admin-input h-16 font-black text-slate-900 dark:text-white bg-white dark:bg-zinc-900"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest block px-1">
                                        Địa chỉ trụ sở pháp lý
                                    </label>
                                    <input
                                        value={settings.address}
                                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                        className="admin-input h-16 font-black text-slate-900 dark:text-white bg-white dark:bg-zinc-900 uppercase tracking-tight"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                             <div className="admin-card p-10 border-white/40 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 rounded-[2.5rem]">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-8">
                                    Tùy chỉnh giao diện
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <button 
                                        onClick={() => theme !== 'light' && toggleTheme()}
                                        className={cn(
                                            "p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4",
                                            theme === 'light' 
                                                ? "bg-white border-orange-500 shadow-xl shadow-orange-100" 
                                                : "bg-slate-50 border-transparent text-slate-400 hover:bg-white"
                                        )}
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-2">
                                            <Sun size={32} />
                                        </div>
                                        <p className="font-black uppercase tracking-widest text-xs">Chế độ sáng</p>
                                    </button>
                                    <button 
                                        onClick={() => theme !== 'dark' && toggleTheme()}
                                        className={cn(
                                            "p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4",
                                            theme === 'dark' 
                                                ? "bg-zinc-800 border-orange-500 shadow-xl shadow-zinc-950" 
                                                : "bg-zinc-900/50 border-transparent text-zinc-500 hover:bg-zinc-900"
                                        )}
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-orange-500 mb-2">
                                            <Moon size={32} />
                                        </div>
                                        <p className="font-black uppercase tracking-widest text-xs">Chế độ tối</p>
                                    </button>
                                </div>
                             </div>
                        </div>
                    )}

                    {activeTab === 'notification' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    id: 'notifications',
                                    label: 'Thông báo đơn hàng',
                                    desc: 'Push notification khi có order mới',
                                    icon: Bell,
                                    active: settings.notifications,
                                    color: 'text-orange-600',
                                    bg: 'bg-orange-50 dark:bg-orange-950/20',
                                },
                                {
                                    id: 'realtimeSync',
                                    label: 'Real-time Syncing',
                                    desc: 'Đồng bộ hóa Socket.io tức thời',
                                    icon: Zap,
                                    active: settings.realtimeSync,
                                    color: 'text-amber-600',
                                    bg: 'bg-amber-50 dark:bg-amber-950/20',
                                },
                                {
                                    id: 'twoFactor',
                                    label: 'Bảo mật 2FA (Auth)',
                                    desc: 'Yêu cầu mã khi rút tiền/thống kê',
                                    icon: Shield,
                                    active: settings.twoFactor,
                                    color: 'text-rose-600',
                                    bg: 'bg-rose-50 dark:bg-rose-950/20',
                                },
                                {
                                    id: 'cloudBackup',
                                    label: 'Cloud Backup',
                                    desc: 'Sao lưu DB tự động mỗi 24 giờ',
                                    icon: HardDrive,
                                    active: settings.cloudBackup,
                                    color: 'text-emerald-600',
                                    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
                                },
                            ].map((item) => (
                                <div
                                    key={item.id}
                                    className="admin-card p-8 border-white/40 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 flex items-center justify-between group hover:border-orange-400/40 transition-all duration-500 rounded-[2.5rem]"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110", item.bg, item.color)}>
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                                {item.label}
                                            </p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-300 font-bold uppercase tracking-widest mt-1">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={item.active}
                                            onChange={(e) => setSettings({ ...settings, [item.id]: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-8 bg-slate-100 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600 shadow-inner"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ADVANCED SETTINGS */}
                    <div className="admin-card p-10 bg-slate-900 border-slate-800 flex flex-col lg:flex-row items-center gap-10 relative overflow-hidden rounded-[3rem] shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                        <div className="w-20 h-20 rounded-[2rem] bg-orange-600 flex items-center justify-center text-white shrink-0 shadow-xl shadow-orange-900/20">
                            <Cpu size={40} />
                        </div>
                        <div className="flex-1 space-y-4 text-center lg:text-left">
                            <h4 className="text-2xl font-black text-white tracking-tight uppercase">
                                Cấu hình máy chủ hệ thống
                            </h4>
                            <p className="text-slate-400 font-bold text-sm leading-relaxed">
                                Các thiết lập này ảnh hưởng trực tiếp đến hiệu năng của API và cơ sở dữ liệu. Chỉ nên điều chỉnh khi có sự hướng dẫn của quản trị viên hạ tầng kỹ thuật.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                                <button 
                                    onClick={() => toast.loading('Đang kiểm tra kết nối...')}
                                    className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                                >
                                    Kiểm tra kết nối DB
                                </button>
                                <button 
                                    onClick={() => toast.success('Đã dọn dẹp bộ nhớ đệm')}
                                    className="px-8 py-3 bg-white/5 hover:bg-rose-600/20 border border-white/10 hover:border-rose-500/50 text-slate-400 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                                >
                                    Xóa Cache hệ thống
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;

