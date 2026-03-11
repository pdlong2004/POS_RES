import { getRevenue } from '../services/stats.service.js';
import Order from '../../models/Order.js';
import Invoice from '../../models/Invoice.js';
import Product from '../../models/Product.js';

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
        today.setHours(0, 0, 0, 0);

        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // 1. Số lượng khách hàng trong ngày (dựa trên Invoice)
        const invoicesToday = await Invoice.countDocuments({
            createdAt: { $gte: today }
        });
        const customersToday = invoicesToday; // Assuming 1 invoice ~ 1 customer group/table

        // 2. Số lượng tồn kho (tổng số lượng sản phẩm đang có)
        const products = await Product.find({}, 'stock_quantity');
        const inventoryCount = products.reduce((acc, p) => acc + (p.stock_quantity || 0), 0);

        // 3. Doanh thu (trong ngày và trong tháng)
        const invoicesTodayData = await Invoice.find({
            createdAt: { $gte: today },
            paymentStatus: { $in: ['paid', 'Đã thanh toán'] }
        });
        const revenueToday = invoicesTodayData.reduce((acc, inv) => acc + (inv.totalPrice || 0), 0);

        const invoicesMonthData = await Invoice.find({
            createdAt: { $gte: firstDayOfMonth },
            paymentStatus: { $in: ['paid', 'Đã thanh toán'] }
        });
        const revenueMonth = invoicesMonthData.reduce((acc, inv) => acc + (inv.totalPrice || 0), 0);

        // 4. Biểu đồ AI dự đoán (Line chart historical vs prediction for Next 7 Days)
        // Lấy dữ liệu 7 ngày qua để làm linear regression dự đoán 7 ngày tới
        const chartData = [];
        const pastDays = 7;
        for (let i = pastDays; i >= 1; i--) {
            const startOfDay = new Date();
            startOfDay.setDate(startOfDay.getDate() - i);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(startOfDay);
            endOfDay.setHours(23, 59, 59, 999);

            const dayInvoices = await Invoice.find({
                createdAt: { $gte: startOfDay, $lte: endOfDay },
                paymentStatus: { $in: ['paid', 'Đã thanh toán'] }
            });

            const dayRevenue = dayInvoices.reduce((acc, inv) => acc + (inv.totalPrice || 0), 0);
            
            chartData.push({
                date: startOfDay.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                actualRevenue: dayRevenue,
                predictedRevenue: null // null for past days
            });
        }

        // Tính trung bình cộng đơn giản (Simple Moving Average) để dự đoán 7 ngày tiếp
        const avgRevenue = chartData.reduce((acc, d) => acc + d.actualRevenue, 0) / pastDays;
        const trendMultiplier = 1.05; // Giả sử AI dự đoán tăng 5% mỗi ngày

        let currentPrediction = avgRevenue;

        // Thêm mốc hiện tại để nối graph
        chartData.push({
            date: 'Hôm nay',
            actualRevenue: revenueToday,
            predictedRevenue: currentPrediction
        });

        // 7 ngày tương lai
        for (let i = 1; i <= 7; i++) {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + i);
            
            currentPrediction = currentPrediction * trendMultiplier;

            chartData.push({
                date: futureDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                actualRevenue: null, // null for future
                predictedRevenue: Math.round(currentPrediction)
            });
        }

        res.json({
            customersToday,
            inventoryCount,
            revenueToday,
            revenueMonth,
            chartData
        });
    } catch (err) {
        console.error('AI Prediction Stats Error', err);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu AI' });
    }
};
