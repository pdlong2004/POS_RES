import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Bell, Settings, User, Menu, X, CheckCircle2 } from 'lucide-react';
import { socket } from '../../../socket.js';
import { getNotificationsApi, markAsReadApi, markAllAsReadApi } from '../../../service/notification.service.js';
import { useToast } from '../../../context/ToastContext.jsx';

const HeaderAdmin = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

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
        if (notif.link) {
            navigate(notif.link);
        }

        if (!notif.isRead) {
            try {
                await markAsReadApi(notif._id);
                setNotifications((prev) =>
                    prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
                );
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

    const handleLogout = () => {
        navigate('/admin');
    };

    return (
        <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="">
                            <NavLink to="/">
                                <img src="https://manwah.com.vn/images/logo/manwah.svg" width="150" alt="Logo" />
                            </NavLink>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsNotificationOpen(!isNotificationOpen);
                                    setIsDropdownOpen(false);
                                }}
                                className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors relative"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 text-[10px] flex items-center justify-center font-bold text-white bg-red-500 rounded-full">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                        <h3 className="text-sm font-semibold text-slate-900">Thông báo</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={handleMarkAllAsRead}
                                                className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                                            >
                                                <CheckCircle2 size={14} />
                                                Đánh dấu đã xem
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <div
                                                    key={notif._id}
                                                    onClick={() => handleNotificationClick(notif)}
                                                    className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${
                                                        !notif.isRead ? 'bg-orange-50/50' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`text-sm ${!notif.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                                                            {notif.title}
                                                        </p>
                                                        {!notif.isRead && <span className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                        {notif.message}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400 mt-2 block">
                                                        {new Date(notif.createdAt).toLocaleString('vi-VN')}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-8 text-center text-slate-500 text-sm">
                                                Không có thông báo nào
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className="hidden sm:inline-flex p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                            <Settings size={20} />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">A</span>
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-slate-900">Quản lý</p>
                                    <p className="text-xs text-slate-500">admin@nha-hang.vn</p>
                                </div>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                                        <p className="text-sm font-medium text-slate-900">Quản lý</p>
                                        <p className="text-xs text-slate-500">admin@nha-hang.vn</p>
                                    </div>

                                    <div className="py-2">
                                        <NavLink
                                            to="/admin/profile"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                        >
                                            <User size={16} />
                                            Hồ sơ
                                        </NavLink>
                                        <NavLink
                                            to="/admin/settings"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                        >
                                            <Settings size={16} />
                                            Cài đặt
                                        </NavLink>
                                    </div>

                                    <div className="border-t border-slate-100 py-2">
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderAdmin;
