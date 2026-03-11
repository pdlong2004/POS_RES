import React from 'react';
import HeaderAdmin from '@/components/admin/shared/HeaderAdmin';
import SidebarAdmin from '@/components/admin/shared/SidebarAdmin';
import { Button } from '@/components/ui/button';
import { Bell, Globe, Moon, Shield, Store, Printer } from 'lucide-react';

const AdminSettings = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <HeaderAdmin />
            <div className="flex flex-1 overflow-hidden">
                <SidebarAdmin />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Cài đặt Hệ thống</h1>
                            <p className="text-slate-500">Cấu hình các chức năng và hiển thị của phần mềm</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            {/* Settings Grid */}
                            <div className="divide-y divide-slate-100">
                                {/* Store Info */}
                                <div className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                                            <Store className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-900">Thông tin Cửa hàng</h3>
                                            <p className="text-sm text-slate-500 mt-1">Cập nhật tên, địa chỉ, logo và thông tin liên hệ của cửa hàng hiển thị trên hóa đơn.</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="shrink-0">Cấu hình</Button>
                                </div>

                                {/* Notifications */}
                                <div className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                            <Bell className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-900">Thông báo</h3>
                                            <p className="text-sm text-slate-500 mt-1">Quản lý cách nhận cảnh báo khi có đơn hàng mới hoặc món hết kho.</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-2">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* Appearance */}
                                <div className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                            <Moon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-900">Giao diện (Chế độ tối)</h3>
                                            <p className="text-sm text-slate-500 mt-1">Chuyển đổi giao diện sáng tối để dịu mắt hơn khi làm việc buổi tối.</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-2">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* Security */}
                                <div className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-900">Bảo mật & Phân quyền</h3>
                                            <p className="text-sm text-slate-500 mt-1">Kiểm soát phân quyền nhân viên, yêu cầu đổi mật khẩu định kỳ.</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="shrink-0">Tùy chỉnh</Button>
                                </div>

                                {/* Printer configuration */}
                                <div className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
                                            <Printer className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-900">Máy in & Bill</h3>
                                            <p className="text-sm text-slate-500 mt-1">Cài đặt kết nối máy in hóa đơn, máy in bếp và mẫu giấy in.</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="shrink-0">Cài đặt máy in</Button>
                                </div>
                            </div>
                        </div>

                        {/* Save Actions */}
                        <div className="flex justify-end gap-3">
                            <Button variant="outline">Khôi phục mặc định</Button>
                            <Button className="bg-orange-600 hover:bg-orange-700">Lưu cài đặt</Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminSettings;
