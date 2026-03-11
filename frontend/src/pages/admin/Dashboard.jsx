import React from 'react';
import SalesOverview from '@/components/admin/Dashboard/SalesOverview';
import StatsChart from '@/components/admin/Dashboard/StatsChart';
import HeaderAdmin from '@/components/admin/shared/HeaderAdmin';
import SidebarAdmin from '@/components/admin/shared/SidebarAdmin';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-background">
            <HeaderAdmin />

            <div className="flex">
                <SidebarAdmin />

                <main className="flex-1 container mx-auto px-6 py-8 space-y-8">
                    <SalesOverview />
                    <StatsChart />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
