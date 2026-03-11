import React from 'react';
import { useAuth } from '@/context/AuthContext';
import HeaderAdmin from '@/components/admin/shared/HeaderAdmin';
import SidebarAdmin from '@/components/admin/shared/SidebarAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, MapPin, Shield, Camera } from 'lucide-react';

const AdminProfile = () => {
    const { user, roleName } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <HeaderAdmin />
            <div className="flex flex-1 overflow-hidden">
                <SidebarAdmin />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Hồ sơ Của Tôi</h1>
                            <p className="text-slate-500">Quản lý thông tin cá nhân và tài khoản của bạn</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Profile Card */}
                            <div className="md:col-span-1 border border-slate-200 bg-white rounded-xl shadow-sm p-6 flex flex-col items-center">
                                <div className="relative mb-4">
                                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold">
                                        {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-orange-600 shadow-sm">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">{user?.username || 'Admin User'}</h2>
                                <p className="text-sm text-slate-500 mb-4">{user?.email}</p>
                                
                                <div className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg justify-center text-sm font-medium text-slate-700">
                                    <Shield className="w-4 h-4 text-orange-600" />
                                    {roleName || 'Quản trị viên'}
                                </div>
                            </div>

                            {/* Details Form */}
                            <div className="md:col-span-2 border border-slate-200 bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-6">Thông tin chi tiết</h3>
                                
                                <form className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Tên truy cập</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <Input 
                                                    value={user?.username || ''} 
                                                    readOnly 
                                                    className="pl-9 bg-slate-50 cursor-not-allowed" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Họ và tên</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <Input 
                                                    defaultValue={user?.fullName || ''} 
                                                    placeholder="Nhập họ và tên..." 
                                                    className="pl-9" 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Email liên hệ</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input 
                                                value={user?.email || ''} 
                                                readOnly 
                                                className="pl-9 bg-slate-50 cursor-not-allowed" 
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500">Email này được sử dụng để nhận thông báo từ hệ thống.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Số điện thoại</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <Input 
                                                    defaultValue={user?.phone || ''} 
                                                    placeholder="Nhập số điện thoại..." 
                                                    className="pl-9" 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                                        <Button type="button" variant="outline">Hiệu chỉnh mật khẩu</Button>
                                        <Button type="button" className="bg-orange-600 hover:bg-orange-700">Lưu thay đổi</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminProfile;
