import React from 'react';
import HeaderAdmin from '@/components/admin/shared/HeaderAdmin';
import SidebarAdmin from '@/components/admin/shared/SidebarAdmin';
import StatsChart from '@/components/admin/Dashboard/StatsChart';
import AIPredictions from '@/components/admin/Dashboard/AIPredictions';

const AdminReports = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
            <HeaderAdmin />

            <div className="flex">
                <SidebarAdmin />

                <main className="flex-1 container mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8 items-center justify-between flex">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Báo cáo Thống kê</h1>
                            <p className="text-slate-600">Phân tích chuyên sâu về doanh thu và hoạt động kinh doanh</p>
                        </div>
                    </div>

                    {/* Stats & Charts */}
                    <div className="space-y-8">
                        {/* AI Predictive Dashboard */}
                        <AIPredictions />

                        {/* Revenue Chart */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                            <StatsChart />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminReports;
