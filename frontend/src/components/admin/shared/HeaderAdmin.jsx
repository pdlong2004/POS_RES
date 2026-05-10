import React, { useState, useEffect, useCallback, memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '@/lib/axois';
import {
    LogOut,
    Bell,
    User,
    Sun,
    Moon,
    Search,
    Menu,
    X as CloseIcon,
    ChevronRight,
    RefreshCw,
    Shield,
} from 'lucide-react';
import { socket } from '../../../socket.js';
import { getNotificationsApi, markAsReadApi, markAllAsReadApi } from '../../../service/notification.service.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTheme } from '../../../context/ThemeContext.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { cn } from '@/lib/utils';

const HeaderAdmin = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [showSearchModal, setShowSearchModal] = useState(false);

    const toggleSidebar = useCallback(() => {
        const nextState = !isSidebarOpen;
        setIsSidebarOpen(nextState);
        window.dispatchEvent(new CustomEvent('toggle-admin-sidebar', { detail: nextState }));
    }, [isSidebarOpen]);

    useEffect(() => {
        const handleSync = (e) => setIsSidebarOpen(e.detail);
        window.addEventListener('toggle-admin-sidebar', handleSync);
        return () => window.removeEventListener('toggle-admin-sidebar', handleSync);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await getNotificationsApi();
            if (res.success) {
                setNotifications(res.data);
                setUnreadCount(res.data.filter((n) => !n.isRead).length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        socket.on('newNotification', (newNotif) => {
            setNotifications((prev) => [newNotif, ...prev].slice(0, 50));
            setUnreadCount((prev) => prev + 1);
            toast.info(newNotif.title, newNotif.message);
        });
        return () => {
            socket.off('newNotification');
        };
    }, []);

    const handleNotificationClick = async (notif) => {
        setIsNotificationOpen(false);
        if (notif.link) navigate(notif.link);
        if (!notif.isRead) {
            try {
                await markAsReadApi(notif._id);
                setNotifications((prev) => prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n)));
                setUnreadCount((prev) => Math.max(0, prev - 1));
            } catch (error) {
                console.error('Lỗi khi đánh dấu đã đọc', error);
            }
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsReadApi();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Lỗi khi đánh dấu tất cả đã đọc', error);
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest('[data-dropdown]')) {
                setIsDropdownOpen(false);
                setIsNotificationOpen(false);
            }
            if (!e.target.closest('[data-search-area]')) {
                setShowSearchModal(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Cmd + K Shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setShowSearchModal(true);
            }
            if (e.key === 'Escape') {
                setShowSearchModal(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Fetch products for global search (cached)
    const fetchSearchData = async () => {
        if (allProducts.length > 0) return;
        try {
            const res = await api.get('/products');
            setAllProducts(res.data.data || res.data || []);
        } catch (error) {
            console.error('Search data fetch failed', error);
        }
    };

    useEffect(() => {
        if (showSearchModal) {
            fetchSearchData();
        }
    }, [showSearchModal]);

    // Perform Search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(() => {
            const query = searchQuery.toLowerCase();
            const results = allProducts
                .filter((p) => p.name?.toLowerCase().includes(query) || p.categoryId?.name?.toLowerCase().includes(query))
                .slice(0, 8);
            setSearchResults(results);
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, allProducts]);

    return (
        <header className="sticky top-0 z-[60] w-full h-16 md:h-[4.5rem] bg-white/95 dark:bg-zinc-950/95 supports-[backdrop-filter]:bg-white/85 supports-[backdrop-filter]:dark:bg-zinc-950/85 supports-[backdrop-filter]:backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 flex items-center px-4 md:px-6 gap-4 md:gap-6 transition-colors duration-200">
            {/* Mobile Toggle */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                aria-label={isSidebarOpen ? 'Đóng menu' : 'Mở menu'}
            >
            {isSidebarOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
            </button>

            {/* Brand Logo Section */}
            <div className="hidden lg:flex items-center gap-4 shrink-0">
                <div className="w-10 h-10 flex items-center justify-center">
                    <img 
                        src="https://manwah.com.vn/images/logo/manwah.svg" 
                        alt="Manwah Logo" 
                        className="w-full h-full object-contain"
                    />
                </div>
                <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white leading-none tracking-tighter">MANWAH</h2>
                    <p className="text-[8px] text-orange-600 font-black uppercase tracking-[0.2em] mt-0.5">Taiwanese Hotpot</p>
                </div>
            </div>

            {/* Global Search */}
            <div className="hidden lg:flex flex-1 max-w-2xl relative" data-search-area>
                <div
                    onClick={() => setShowSearchModal(true)}
                    className="w-full flex items-center bg-slate-100/80 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-5 py-2.5 gap-3 cursor-text hover:bg-white dark:hover:bg-zinc-800 hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors duration-200"
                >
                    <Search size={20} className="text-slate-400 dark:text-slate-400" />
                    <span className="text-sm font-semibold text-slate-400 dark:text-slate-400 flex-1">Tìm kiếm sản phẩm, đơn hàng hoặc nhân sự...</span>
                </div>

                {showSearchModal && (
                    <div className="absolute top-0 left-0 w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-[100] p-4 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-4 px-4 py-2 border-b border-slate-100 dark:border-zinc-800 mb-4">
                            <Search size={20} className="text-orange-500" />
                            <input
                                autoFocus
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Gõ tên món ăn, danh mục..."
                                className="bg-transparent text-lg font-bold outline-none w-full text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-500"
                            />
                            <button
                                onClick={() => setShowSearchModal(false)}
                                className="p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-slate-400"
                            >
                                <CloseIcon size={20} />
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto scrollbar-hide space-y-2">
                            {isSearching ? (
                                <div className="py-10 text-center">
                                    <RefreshCw size={24} className="animate-spin text-orange-500 mx-auto mb-4" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Đang ánh xạ dữ liệu...
                                    </p>
                                </div>
                            ) : searchQuery && searchResults.length === 0 ? (
                                <div className="py-10 text-center">
                                    <p className="text-sm font-bold text-slate-400">Không tìm thấy kết quả</p>
                                </div>
                            ) : searchQuery ? (
                                searchResults.map((product) => (
                                    <div
                                        key={product._id}
                                        onClick={() => {
                                            navigate('/admin/products');
                                            setShowSearchModal(false);
                                        }}
                                        className="flex items-center gap-4 p-3 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-xl cursor-pointer group transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 overflow-hidden flex items-center justify-center">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    className="w-full h-full object-cover"
                                                    alt=""
                                                />
                                            ) : (
                                                <Search size={16} className="text-slate-200" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
                                                {product.name}
                                            </p>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                                                {product.categoryId?.name || 'Sản phẩm'} •{' '}
                                                {product.price?.toLocaleString()} VND
                                            </p>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-200 group-hover:text-orange-600" />
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center">
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                        Tìm nhanh: Pizza, Pasta, Signature...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 ml-auto">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                    aria-label="Đổi giao diện sáng tối"
                >
                    {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                </button>

                {/* Notifications */}
                <div className="relative" data-dropdown>
                    <button
                        onClick={() => {
                            setIsNotificationOpen(!isNotificationOpen);
                            setIsDropdownOpen(false);
                        }}
                        className={cn(
                            'relative p-2.5 rounded-2xl transition-all duration-300',
                            isNotificationOpen
                                ? 'bg-slate-100 dark:bg-zinc-800 text-orange-600'
                                : 'text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-slate-100 dark:hover:bg-zinc-800',
                        )}
                        aria-label="Thông báo"
                    >
                        <Bell size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-4 h-4 text-[9px] flex items-center justify-center font-bold text-white bg-red-500 rounded-full border-2 border-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {isNotificationOpen && (
                        <div className="absolute right-0 mt-4 w-[min(24rem,calc(100vw-2rem))] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden z-[70] shadow-xl animate-in fade-in zoom-in-95 duration-150">
                            <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 flex justify-between items-center gap-4">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-widest">
                                    Notifications
                                </h3>
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-[10px] text-orange-600 hover:text-orange-700 font-bold uppercase tracking-widest transition-colors"
                                >
                                    Mark all as read
                                </button>
                            </div>
                            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif._id}
                                            onClick={() => handleNotificationClick(notif)}
                                            className={cn(
                                                'px-5 py-4 cursor-pointer hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-colors duration-150 group',
                                                !notif.isRead && 'bg-orange-50/20 dark:bg-orange-950/10',
                                            )}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className={cn(
                                                        'w-2 h-2 mt-2 rounded-full shrink-0',
                                                        !notif.isRead ? 'bg-orange-600 shadow-lg shadow-orange-200' : 'bg-transparent',
                                                    )}
                                                />
                                                <div className="space-y-1 flex-1">
                                                    <p className={cn(
                                                        'text-sm leading-tight transition-colors font-bold',
                                                        !notif.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                                                    )}>
                                                        {notif.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                        {notif.message}
                                                    </p>
                                                    <p className="text-[9px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-tighter pt-1">
                                                        {new Date(notif.createdAt).toLocaleString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center">
                                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                                            No new notifications
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative" data-dropdown>
                    <button
                        onClick={() => {
                            setIsDropdownOpen(!isDropdownOpen);
                            setIsNotificationOpen(false);
                        }}
                        className="flex items-center gap-3 group"
                        aria-label="Mở tài khoản"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">
                                {user?.name || 'Alex Sterling'}
                            </p>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                                {user?.roleId?.name || 'PRO ACCOUNT'}
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-4 w-72 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden z-[70] shadow-xl animate-in fade-in zoom-in-95 duration-150">
                             <div className="px-6 py-6 bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center font-bold text-xl text-orange-600 shadow-sm">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-bold text-slate-900 dark:text-white truncate">
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-semibold">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 space-y-1">
                                <NavLink
                                    to="/admin/profile"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600 rounded-xl transition-colors"
                                >
                                    <User size={18} /> Profile
                                </NavLink>
                                <NavLink
                                    to="/admin/settings"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600 rounded-xl transition-colors"
                                >
                                    <Shield size={18} /> Settings
                                </NavLink>
                            </div>
                            <div className="p-4 border-t border-slate-100 dark:border-zinc-800">
                                <button
                                    onClick={() => {
                                        if (logout) logout();
                                        navigate('/admin');
                                    }}
                                    className="w-full flex items-center gap-4 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default memo(HeaderAdmin);
