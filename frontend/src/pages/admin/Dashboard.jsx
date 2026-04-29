import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SalesOverview from '@/components/admin/Dashboard/SalesOverview';
import StatsChart from '@/components/admin/Dashboard/StatsChart';
import TopSellers from '@/components/admin/Dashboard/TopSellers';
import AdminLayout from '@/components/admin/shared/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axois';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const res = await api.get('/reports/top-selling-products?limit=5');
                if (res.data.success) {
                    setTopProducts(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching top products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopProducts();
    }, []);

    // Helper for greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Morning';
        if (hour < 18) return 'Afternoon';
        return 'Evening';
    };

    return (
        <AdminLayout className="space-y-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        {getGreeting()}, {user?.name?.split(' ')[0] || 'Alex'}.
                    </h1>
                    <p className="text-slate-500 dark:text-slate-300 font-bold text-sm">
                        You have some new orders and performance updates today.
                    </p>
                </div>

            </div>

            {/* Stats Overview */}
            <SalesOverview />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Performance Chart */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Hiệu suất vận hành</h3>
                    </div>
                    <StatsChart />
                </div>

                {/* Secondary Cards Column */}
                <div className="space-y-8">
                     <div className="px-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sản phẩm bán chạy</h3>
                    </div>
                    <TopSellers products={topProducts} loading={loading} />
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;

