import { getRevenue } from '../services/stats.service.js';
import Order from '../../models/Order.js';
import Invoice from '../../models/Invoice.js';
import InvoiceArchive from '../../models/InvoiceArchive.js';
import Product from '../../models/Product.js';
import OrderDetail from '../../models/OrderDetail.js';
import Category from '../../models/Category.js';

export const revenueStats = async (req, res) => {
    try {
        const type = req.query.type || 'year';
        const year = Number(req.query.year) || new Date().getFullYear();
        const month = Number(req.query.month);

        const data = await getRevenue({ type, year, month });

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

export const getAIPredictions = async (req, res) => {
    try {
        const today = new Date();
        // Set to start of day in Asia/Ho_Chi_Minh
        const localToday = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
        localToday.setHours(0, 0, 0, 0);

        const firstDayOfMonth = new Date(localToday.getFullYear(), localToday.getMonth(), 1);

        // 1. Số lượng khách hôm nay (Invoices created today)
        const customersToday = await Invoice.countDocuments({
            createdAt: { $gte: localToday },
            paymentStatus: { $ne: 'cancelled' },
        });

        // 2. Tổng tồn kho
        const products = await Product.find({}, 'stock_quantity');
        const inventoryCount = products.reduce((acc, p) => acc + (p.stock_quantity || 0), 0);

        // 3. Doanh thu hôm nay và tháng này
        const revenueTodayData = await Invoice.aggregate([
            {
                $match: {
                    createdAt: { $gte: localToday },
                    paymentStatus: { $in: ['paid', 'Đã thanh toán', 'closed'] },
                },
            },
            {
                $unionWith: {
                    coll: 'invoicearchives',
                    pipeline: [
                        {
                            $match: {
                                createdAt: { $gte: localToday },
                                paymentStatus: { $in: ['paid', 'Đã thanh toán', 'closed'] },
                            },
                        },
                    ],
                },
            },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);
        const revenueToday = revenueTodayData[0]?.total || 0;

        const revenueMonthData = await Invoice.aggregate([
            {
                $match: {
                    createdAt: { $gte: firstDayOfMonth },
                    paymentStatus: { $in: ['paid', 'Đã thanh toán', 'closed'] },
                },
            },
            {
                $unionWith: {
                    coll: 'invoicearchives',
                    pipeline: [
                        {
                            $match: {
                                createdAt: { $gte: firstDayOfMonth },
                                paymentStatus: { $in: ['paid', 'Đã thanh toán', 'closed'] },
                            },
                        },
                    ],
                },
            },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);
        const revenueMonth = revenueMonthData[0]?.total || 0;

        // 4. Historical vs Predicted (7 days past, 7 days future)
        const sevenDaysAgo = new Date(localToday);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const historicalStats = await Invoice.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo, $lt: localToday },
                    paymentStatus: { $in: ['paid', 'Đã thanh toán', 'closed'] },
                },
            },
            {
                $unionWith: {
                    coll: 'invoicearchives',
                    pipeline: [
                        {
                            $match: {
                                createdAt: { $gte: sevenDaysAgo, $lt: localToday },
                                paymentStatus: { $in: ['paid', 'Đã thanh toán', 'closed'] },
                            },
                        },
                    ],
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%d/%m', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } },
                    revenue: { $sum: '$totalPrice' },
                    timestamp: { $min: '$createdAt' },
                },
            },
            { $sort: { timestamp: 1 } },
        ]);

        const chartData = [];
        // Fill past 7 days with matches
        for (let i = 7; i >= 1; i--) {
            const d = new Date(localToday);
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
            const record = historicalStats.find((h) => h._id === label);

            chartData.push({
                date: label,
                actualRevenue: record ? record.revenue : 0,
                predictedRevenue: null,
            });
        }

        const avgRevenue =
            chartData.length > 0 ? chartData.reduce((acc, d) => acc + d.actualRevenue, 0) / chartData.length : 0;

        const trendMultiplier = 1.05;
        let currentPrediction = avgRevenue || 1000000; // Default base if no data

        // Add "Hôm nay"
        chartData.push({
            date: 'Hôm nay',
            actualRevenue: revenueToday,
            predictedRevenue: Math.round(currentPrediction),
        });

        // 7 days future
        for (let i = 1; i <= 7; i++) {
            const f = new Date(localToday);
            f.setDate(f.getDate() + i);
            currentPrediction *= trendMultiplier;

            chartData.push({
                date: f.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                actualRevenue: null,
                predictedRevenue: Math.round(currentPrediction),
            });
        }

        res.json({
            customersToday,
            inventoryCount,
            revenueToday,
            revenueMonth,
            chartData,
        });
    } catch (err) {
        console.error('AI Prediction Stats Error', err);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu AI' });
    }
};

export const getAdvancedStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Top 5 Best Sellers (Unified: OrderDetail + InvoiceArchive.items)
        const topSellers = await InvoiceArchive.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                },
            },
            {
                $unionWith: {
                    coll: 'orderdetails',
                    pipeline: [
                        {
                            $group: {
                                _id: '$productId',
                                totalSold: { $sum: '$quantity' },
                                totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
                            },
                        },
                    ],
                },
            },
            {
                $group: {
                    _id: '$_id',
                    totalSold: { $sum: '$totalSold' },
                    totalRevenue: { $sum: '$totalRevenue' },
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: 1,
                    name: '$product.name',
                    image: '$product.image',
                    price: '$product.price',
                    totalSold: 1,
                    totalRevenue: 1,
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
        ]);

        // 2. Revenue Distribution by Category (Unified)
        const categoryStats = await InvoiceArchive.aggregate([
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'product.categoryId',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $unwind: '$category' },
            {
                $group: {
                    _id: '$category._id',
                    name: { $first: '$category.name' },
                    value: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                },
            },
            {
                $unionWith: {
                    coll: 'orderdetails',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'products',
                                localField: 'productId',
                                foreignField: '_id',
                                as: 'product',
                            },
                        },
                        { $unwind: '$product' },
                        {
                            $lookup: {
                                from: 'categories',
                                localField: 'product.categoryId',
                                foreignField: '_id',
                                as: 'category',
                            },
                        },
                        { $unwind: '$category' },
                        {
                            $group: {
                                _id: '$category._id',
                                name: { $first: '$category.name' },
                                value: { $sum: { $multiply: ['$quantity', '$price'] } },
                            },
                        },
                    ],
                },
            },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    value: { $sum: '$value' }
                }
            }
        ]);

        // 3. Payment Method Distribution (Unified)
        const paymentStats = await Invoice.aggregate([
            { $match: { paymentStatus: { $in: ['paid', 'Đã thanh toán', 'closed'] } } },
            {
                $unionWith: {
                    coll: 'invoicearchives',
                    pipeline: [{ $match: { paymentStatus: 'paid' } }]
                }
            },
            {
                $group: {
                    _id: '$paymentMethod',
                    value: { $sum: '$totalPrice' },
                    count: { $sum: 1 },
                },
            },
        ]);

        // 4. Hourly Sales (Peak Hours) (Unified)
        const hourlyStats = await Invoice.aggregate([
            { $match: { paymentStatus: { $in: ['paid', 'Đã thanh toán', 'closed'] } } },
            {
                $unionWith: {
                    coll: 'invoicearchives',
                    pipeline: [{ $match: { paymentStatus: 'paid' } }]
                }
            },
            {
                $group: {
                    _id: { $hour: { date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } },
                    revenue: { $sum: '$totalPrice' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Fill gaps in hourly stats
        const fullHourlyStats = Array.from({ length: 24 }, (_, i) => {
            const hourData = hourlyStats.find((h) => h._id === i);
            return {
                hour: `${i}h`,
                revenue: hourData ? hourData.revenue : 0,
                orders: hourData ? hourData.count : 0,
            };
        });

        // 5. General Summary (Unified)
        const totalPaidInvoicesCount = await Invoice.countDocuments({ paymentStatus: { $in: ['paid', 'Đã thanh toán', 'closed'] } });
        const totalArchivedCount = await InvoiceArchive.countDocuments({ paymentStatus: 'paid' });
        const totalPaidInvoices = totalPaidInvoicesCount + totalArchivedCount;
        const totalRevenue = paymentStats.reduce((acc, p) => acc + p.value, 0);
        const aov = totalPaidInvoices > 0 ? Math.round(totalRevenue / totalPaidInvoices) : 0;

        // Find peak hour
        const peakHourData = hourlyStats.reduce((prev, current) => (prev.revenue > current.revenue ? prev : current), {
            _id: -1,
            revenue: 0,
        });
        const peakHour = peakHourData._id !== -1 ? `${peakHourData._id}h - ${peakHourData._id + 1}h` : 'N/A';

        res.json({
            topSellers,
            categoryStats,
            paymentStats,
            hourlyStats: fullHourlyStats,
            summary: {
                totalRevenue,
                totalOrders: totalPaidInvoices,
                aov,
                peakHour,
            },
        });
    } catch (err) {
        console.error('Advanced Stats Error', err);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu báo cáo chuyên sâu' });
    }
};

export const getTopSellingProducts = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 5;

        const topSellers = await InvoiceArchive.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                },
            },
            {
                $unionWith: {
                    coll: 'orderdetails',
                    pipeline: [
                        {
                            $group: {
                                _id: '$productId',
                                totalSold: { $sum: '$quantity' },
                                totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
                            },
                        },
                    ],
                },
            },
            {
                $group: {
                    _id: '$_id',
                    totalSold: { $sum: '$totalSold' },
                    totalRevenue: { $sum: '$totalRevenue' },
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: 1,
                    name: '$product.name',
                    image: '$product.image',
                    price: '$product.price',
                    totalSold: 1,
                    totalRevenue: 1,
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: limit },
        ]);

        res.json({
            success: true,
            data: topSellers
        });
    } catch (err) {
        console.error('Top Selling Products Error', err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};
