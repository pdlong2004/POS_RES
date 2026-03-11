import React from 'react';
import { useProductStats } from '@/hooks/useProductStats';
import { useOrderStats } from '@/hooks/useOrderStats';
import { Package, ShoppingCart, TrendingUp, Loader2 } from 'lucide-react';

const SalesOverview = () => {
    const { totalProducts, loading } = useProductStats();
    const { totalOrders } = useOrderStats();

    const StatCard = ({ title, value, icon: Icon, color, isLoading }) => (
        <div className={`relative overflow-hidden rounded-lg border p-6 ${color}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
                    <div className="flex items-baseline gap-2">
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                        ) : (
                            <p className="text-3xl font-bold text-slate-900">{value}</p>
                        )}
                    </div>
                </div>
                <div
                    className={`p-3 rounded-lg ${color === 'bg-linear-to-br from-orange-50 to-orange-100 border-orange-200' ? 'bg-orange-100' : color === 'bg-linear-to-br from-blue-50 to-blue-100 border-blue-200' ? 'bg-blue-100' : 'bg-emerald-100'}`}
                >
                    <Icon
                        className={`w-6 h-6 ${color === 'bg-linear-to-br from-orange-50 to-orange-100 border-orange-200' ? 'text-orange-600' : color === 'bg-linear-to-br from-blue-50 to-blue-100 border-blue-200' ? 'text-blue-600' : 'text-emerald-600'}`}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Tổng quan bán hàng</h2>
                <p className="text-slate-600 text-sm">Theo dõi các chỉ số kinh doanh chính của bạn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Tổng số sản phẩm"
                    value={totalProducts.toString()}
                    icon={Package}
                    color="bg-linear-to-br from-orange-50 to-orange-100 border-orange-200"
                    isLoading={loading}
                />

                <StatCard
                    title="Đơn hàng"
                    value={totalOrders.toString()}
                    icon={ShoppingCart}
                    color="bg-linear-to-br from-blue-50 to-blue-100 border-blue-200"
                    isLoading={false}
                />

                <StatCard
                    title="Tăng trưởng"
                    value="↑ 12%"
                    icon={TrendingUp}
                    color="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
                    isLoading={false}
                />
            </div>
        </div>
    );
};

export default SalesOverview;
