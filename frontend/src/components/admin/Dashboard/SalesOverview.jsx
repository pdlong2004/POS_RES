import React, { useEffect, useState } from 'react';
import { useProductStats } from '@/hooks/useProductStats';
import { useOrderStats } from '@/hooks/useOrderStats';
import { Package, ShoppingCart, TrendingUp, DollarSign, Users } from 'lucide-react';
import StatsCard from '../shared/StatsCard';
import api from '@/lib/axois';

const SalesOverview = () => {
    const { totalProducts } = useProductStats();
    const [stats, setStats] = useState({
        revenueToday: 0,
        revenueMonth: 0,
        customersToday: 0,
        totalOrders: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const res = await api.get('/stats/predictions');
                if (res.data) {
                    setStats({
                        revenueToday: res.data.revenueToday || 0,
                        revenueMonth: res.data.revenueMonth || 0,
                        customersToday: res.data.customersToday || 0,
                        totalOrders: res.data.totalOrders || 0,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardStats();
    }, []);

    const formatPrice = (p) => {
        if (p >= 1000000) return `${(p / 1000000).toFixed(1)}Mđ`;
        return `${(p / 1000).toFixed(0)}Kđ`;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatsCard
                    title="Doanh thu ngày"
                    value={formatPrice(stats.revenueToday)}
                    change={8.1}
                    color="primary"
                    icon={DollarSign}
                />

                <StatsCard
                    title="Lượng khách"
                    value={stats.customersToday.toLocaleString()}
                    change={12.5}
                    color="info"
                    icon={Users}
                />

                <StatsCard
                    title="Doanh thu tháng"
                    value={formatPrice(stats.revenueMonth)}
                    change={15.3}
                    color="success"
                    icon={TrendingUp}
                />

                <StatsCard
                    title="Kho hàng"
                    value={totalProducts.toLocaleString()}
                    change={2.4}
                    color="warning"
                    icon={Package}
                />
        </div>
    );
};

export default SalesOverview;

