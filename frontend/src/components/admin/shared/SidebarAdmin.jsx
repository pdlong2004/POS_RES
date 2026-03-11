import React from 'react';
import { NavLink } from 'react-router-dom';
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
    FileBox,
    Settings,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const items = [
    { to: '/admin/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { to: '/admin/orders', label: 'Quản lý hóa đơn', icon: ShoppingCart },
    { to: '/admin/inventory', label: 'Quản lý kho', icon: Archive },
    { to: '/admin/bookings', label: 'Lịch Đặt Bàn', icon: CalendarDays },
    { to: '/admin/tables', label: 'Quản lý bàn', icon: Users },
    { to: '/admin/products', label: 'Sản phẩm', icon: Package },
    { to: '/admin/categories', label: 'Quản lý danh mục', icon: Layers },
    { to: '/admin/suppliers', label: 'Nhà cung cấp', icon: Truck },
    { to: '/admin/imports', label: 'Phiếu nhập', icon: FileBox },
    { to: '/admin/reports', label: 'Báo cáo thống kê', icon: BarChart3 },
    { to: '/admin/settings', label: 'Cài đặt', icon: Settings },
];

const SidebarAdmin = () => {
    return (
        <aside className="w-64 bg-white border-r border-border min-h-[calc(100vh-64px)]">
            <div className="px-4 py-6">
                <nav className="space-y-1">
                    {items.map((it) => {
                        const Icon = it.icon;
                        return (
                            <NavLink
                                key={it.to}
                                to={it.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm hover:bg-gray-100 ${
                                        isActive ? 'bg-[#F9E7E3] text-[#C0392B]' : 'text-gray-700'
                                    }`
                                }
                            >
                                <Icon className="w-4 h-4" />
                                <span>{it.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default SidebarAdmin;
