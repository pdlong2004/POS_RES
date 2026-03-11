import { getRevenueStatsApi } from '@/service/statsApi.service.js';
import { useEffect, useState } from 'react';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const useRevenueStats = (filterType) => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                setLoading(true);
                setError(null);

                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth() + 1;

                let type = 'year';
                let params = { year };

                if (filterType === 'day') {
                    type = 'month';
                    params.month = month;
                }

                if (filterType === 'hour') {
                    type = 'day';
                    params.month = month;
                }

                const res = await getRevenueStatsApi({
                    type,
                    ...params,
                });

                const rawData = res?.data || [];

                if (!Array.isArray(rawData)) {
                    throw new Error('Revenue data is not an array');
                }

                const formatted = rawData.map((item) => {
                    let label = item.label;

                    if (filterType === 'month') {
                        label = monthNames[item.label - 1];
                    } else if (filterType === 'day') {
                        label = `Ngày ${item.label}`;
                    } else if (filterType === 'hour') {
                        label = `${item.label}h`;
                    }

                    return {
                        label,
                        revenue: item.revenue,
                    };
                });

                setChartData(formatted);
            } catch (err) {
                console.error('[useRevenueStats] Fetch revenue error:', err);
                setError(err);
                setChartData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRevenue();
    }, [filterType]);

    return { chartData, loading, error };
};
