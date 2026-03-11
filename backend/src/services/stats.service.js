import Order from '../../models/Order.js';

export const getRevenue = async ({ type, year, month }) => {
    if (!type) throw new Error('Missing type');

    let start, end, groupId, completeData;

    if (type === 'year') {
        if (!year) throw new Error('Missing year');

        start = new Date(year, 0, 1);
        end = new Date(year + 1, 0, 1);

        groupId = {
            $month: { date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' },
        };

        // Fill all 12 months
        completeData = Array.from({ length: 12 }, (_, i) => ({
            label: i + 1,
            revenue: 0,
            totalOrders: 0,
        }));
    }

    if (type === 'month') {
        if (!year || !month) throw new Error('Missing year or month');

        start = new Date(year, month - 1, 1);
        end = new Date(year, month, 1);

        groupId = {
            $dayOfMonth: { date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' },
        };

        // Fill all days in the month
        const daysInMonth = new Date(year, month, 0).getDate();
        completeData = Array.from({ length: daysInMonth }, (_, i) => ({
            label: i + 1,
            revenue: 0,
            totalOrders: 0,
        }));
    }

    if (type === 'day') {
        if (!year || !month) throw new Error('Missing year or month');

        start = new Date(year, month - 1, 1);
        end = new Date(year, month, 1);

        groupId = {
            $hour: { date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' },
        };

        // Fill all 24 hours
        completeData = Array.from({ length: 24 }, (_, i) => ({
            label: i,
            revenue: 0,
            totalOrders: 0,
        }));
    }

    const results = await Order.aggregate([
        {
            $match: {
                status: { $in: ['pending', 'paid'] },
                createdAt: { $gte: start, $lt: end },
            },
        },
        {
            $group: {
                _id: groupId,
                revenue: { $sum: '$totalPrice' },
                totalOrders: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                _id: 0,
                label: '$_id',
                revenue: 1,
                totalOrders: 1,
            },
        },
    ]);

    // Merge results with complete data
    results.forEach((item) => {
        const index = completeData.findIndex((d) => d.label === item.label);
        if (index !== -1) {
            completeData[index] = item;
        }
    });

    return completeData;
};
