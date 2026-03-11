import Order from '../../models/Order.js';
import OrderDetail from '../../models/OrderDetail.js';
import Invoice from '../../models/Invoice.js';
import Product from '../../models/Product.js';
import Notification from '../../models/Notification.js';
import { io } from '../server.js';

export const createOrder = async (req, res) => {
    try {
        const { tableId, items } = req.body;

        if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Thiếu tableId hoặc danh sách món' });
        }

        const totalPrice = items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0);

        const order = await Order.create({
            tableId,
            status: 'pending',
            totalPrice,
        });

        await OrderDetail.insertMany(
            items.map((i) => ({
                orderId: order._id,
                productId: i.productId,
                quantity: Number(i.quantity) || 1,
                price: Number(i.price) || 0,
            })),
        );

        // Tìm hóa đơn pending hiện tại của bàn hoặc tạo mới
        let invoice = await Invoice.findOne({
            tableId: tableId,
            paymentStatus: 'pending',
        });

        // Deduct stock and check low stock
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock_quantity = Math.max(0, (product.stock_quantity || 0) - (Number(item.quantity) || 1));
                await product.save();
                
                if (product.stock_quantity < 20) {
                    const notify = await Notification.create({
                        title: 'Sắp hết món',
                        message: `Món "${product.name}" hiện chỉ còn ${product.stock_quantity} trong kho.`,
                        type: 'inventory',
                        link: '/admin/inventory',
                    });
                    io.emit('newNotification', notify);
                }
            }
        }

        // Tạo thông báo có order mới
        const orderNotification = await Notification.create({
            title: 'Có đơn gọi món mới',
            message: `Bàn đã gọi món thành công. Tổng tiền tạm tính: ${totalPrice.toLocaleString('vi-VN')}đ.`,
            type: 'order',
            link: '/admin/orders',
        });
        io.emit('newNotification', orderNotification);

        if (invoice) {
            // Cộng dồn vào hóa đơn hiện tại
            invoice.itemsSubtotal += totalPrice;
            // ensure orderIds array exists and push the new order
            if (!Array.isArray(invoice.orderIds)) invoice.orderIds = [];
            invoice.orderIds.push(order._id);
            invoice.calculateTotal();
            await invoice.save();
        } else {
            // Tạo hóa đơn mới
            invoice = new Invoice({
                orderId: order._id,
                orderIds: [order._id],
                tableId: tableId,
                itemsSubtotal: totalPrice,
                taxRate: 10, // VAT 10%
                serviceChargeRate: 5, // Phí phục vụ 5%
                discountRate: 0,
                paymentMethod: 'cash',
                paymentStatus: 'pending',
            });
            invoice.calculateTotal();
            await invoice.save();
        }

        res.status(201).json({
            message: 'Đặt món thành công',
            order: { _id: order._id, tableId: order.tableId, totalPrice: order.totalPrice, status: order.status },
            invoice: { _id: invoice._id, totalPrice: invoice.totalPrice },
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

export const getTotalOrders = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();

        res.status(200).json({
            success: true,
            totalOrders,
        });
    } catch (error) {
        console.error('Get total orders error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('tableId').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Lấy order theo id
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('tableId');
        if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy order' });
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error('Get order by id error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Cập nhật trạng thái nhiều order
export const updateOrdersStatus = async (req, res) => {
    try {
        const { orderIds, status } = req.body;
        if (!Array.isArray(orderIds) || orderIds.length === 0) {
            return res.status(400).json({ success: false, message: 'Thiếu orderIds' });
        }

        await Order.updateMany({ _id: { $in: orderIds } }, { $set: { status } });

        res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
        console.error('Update orders status error:', error);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};
