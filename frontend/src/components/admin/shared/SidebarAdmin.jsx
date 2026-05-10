import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Package,
    CalendarDays,
    BarChart3,
    ShoppingCart,
    Archive,
    Layers,
    Truck,
    Settings,
    Clock,
    Table2,
    ChevronRight,
    ChevronLeft,
    LogOut,
    Fingerprint,
    CalendarCheck,
    ShieldAlert,
    Activity,
    ClipboardList,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { cn } from '@/lib/utils';

const MENU_GROUPS = [
    {
        label: 'Tổng quan',
        items: [
            { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['*'] },
            { to: '/admin/reports', label: 'Báo cáo', icon: BarChart3, roles: ['admin'] },
        ],
    },
    {
        label: 'Vận hành',
        items: [
            { to: '/admin/orders', label: 'Hóa đơn', icon: ShoppingCart, roles: ['*'] },
            { to: '/admin/tables', label: 'Sơ đồ bàn', icon: Table2, roles: ['*'] },

            { to: '/admin/bookings', label: 'Đặt bàn', icon: CalendarDays, roles: ['admin'] },
        ],
    },
    {
        label: 'Thực đơn & Kho',
        items: [
            { to: '/admin/products', label: 'Sản phẩm', icon: Package, roles: ['*'] },
            { to: '/admin/categories', label: 'Danh mục', icon: Layers, roles: ['admin'] },
            { to: '/admin/inventory', label: 'Tồn kho', icon: Archive, roles: ['*'] },
            { to: '/admin/suppliers', label: 'Nhà cung cấp', icon: Truck, roles: ['admin'] },
            { to: '/admin/imports', label: 'Nhập kho', icon: ClipboardList, roles: ['admin'] },
        ],
    },
    {
        label: 'Nhân sự',
        items: [
            { to: '/admin/staff', label: 'Nhân viên', icon: Users, roles: ['admin'] },
            { to: '/admin/shifts', label: 'Ca làm', icon: Clock, roles: ['*'] },
            { to: '/admin/attendance', label: 'Chấm công', icon: Fingerprint, roles: ['admin'] },
            { to: '/admin/my-schedule', label: 'Lịch của tôi', icon: CalendarCheck, roles: ['*'] },
        ],
    },
    {
        label: 'Hệ thống',
        items: [{ to: '/admin/settings', label: 'Cài đặt', icon: Settings, roles: ['admin'] }],
    },
];

const SidebarAdmin = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false); // Mobile drawer
    const [isCollapsed, setIsCollapsed] = useState(false); // Desktop/Tablet mini mode
    const scrollRef = useRef(null);

    // 🚀 PERSIST SCROLL POSITION: Prevent sidebar from resetting to top on navigation
    useEffect(() => {
        const savedScroll = sessionStorage.getItem('admin_sidebar_scroll');
        if (savedScroll && scrollRef.current) {
            scrollRef.current.scrollTop = parseInt(savedScroll, 10);
        }
    }, []);

    const handleScroll = (e) => {
        sessionStorage.setItem('admin_sidebar_scroll', e.target.scrollTop);
    };

    // 🚀 Performance: Sync state with event system for header toggle
    useEffect(() => {
        const handleToggle = (e) => setIsOpen(e.detail);
        window.addEventListener('toggle-admin-sidebar', handleToggle);
        return () => window.removeEventListener('toggle-admin-sidebar', handleToggle);
    }, []);

    const closeSidebar = useCallback(() => {
        setIsOpen(false);
        window.dispatchEvent(new CustomEvent('toggle-admin-sidebar', { detail: false }));
    }, []);

    // Auto-collapse on tablet screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && window.innerWidth < 1280) {
                setIsCollapsed(true);
            } else if (window.innerWidth >= 1280) {
                setIsCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const userRoleObj = user?.roleId || user?.role || {};
    const roleName = (userRoleObj.name || userRoleObj).toString().toLowerCase();
    const isStaff = ['cashier', 'waiter', 'chef', 'staff'].includes(roleName);
    const normalizedRole = isStaff ? 'staff' : roleName === 'admin' ? 'admin' : 'user';

    const canSee = (roles) => roles.includes('*') || roles.includes(normalizedRole);

    return (
        <>
            {/* Backdrop for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-[#09090b]/60 z-[45] lg:hidden animate-in fade-in duration-150"
                    onClick={closeSidebar}
                />
            )}

            <aside
                className={cn(
                    'fixed lg:sticky top-0 h-screen bg-white/95 dark:bg-zinc-950/95 supports-[backdrop-filter]:bg-white/90 supports-[backdrop-filter]:dark:bg-zinc-950/90 supports-[backdrop-filter]:backdrop-blur-md border-r border-slate-200/80 dark:border-zinc-800 flex flex-col z-[50] transition-[width,transform] duration-200 ease-out',
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                    isCollapsed ? 'w-20' : 'w-72',
                )}
            >




                {/* Menu Content */}
                <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto py-3 px-3 scrollbar-hide"
                >
                    {MENU_GROUPS.map((group) => {
                        const visibleItems = group.items.filter((it) => canSee(it.roles));
                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={group.label} className="mb-6 last:mb-0">
                                {!isCollapsed && (
                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 px-4 mb-3">
                                        {group.label}
                                    </p>
                                )}
                                <nav className="space-y-1">
                                    {visibleItems.map((it) => {
                                        const Icon = it.icon;
                                        const isActive = location.pathname === it.to;

                                        return (
                                            <NavLink
                                                key={it.to}
                                                to={it.to}
                                                onClick={() => {
                                                    if (window.innerWidth < 1024) closeSidebar();
                                                }}
                                                className={cn(
                                                    'group relative flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold transition-colors duration-150',
                                                    isActive
                                                        ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-600'
                                                        : 'text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white',
                                                )}
                                                title={isCollapsed ? it.label : ''}
                                            >
                                                <Icon
                                                    className={cn(
                                                        'w-[20px] h-[20px] shrink-0 transition-colors duration-150',
                                                        isActive
                                                            ? 'text-orange-600'
                                                            : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white',
                                                    )}
                                                />
                                                {!isCollapsed && (
                                                    <span className="flex-1 truncate">
                                                        {it.label}
                                                    </span>
                                                )}
                                            </NavLink>
                                        );
                                    })}
                                </nav>
                            </div>
                        );
                    })}
                </div>

                {/* Footer User Section */}
                <div className="p-4 mt-auto">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                        <div className={cn(
                            "flex items-center gap-3",
                            isCollapsed && "justify-center"
                        )}>
                            <div className="relative shrink-0">
                                <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-black text-white shadow-sm">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                </div>
                            </div>

                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                        {user?.name || 'Admin'}
                                    </p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">
                                        {roleName}
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        {!isCollapsed && (
                             <button
                             onClick={logout}
                             className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors font-bold text-xs"
                         >
                             <LogOut size={16} />
                             <span>Đăng xuất</span>
                         </button>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default memo(SidebarAdmin);

