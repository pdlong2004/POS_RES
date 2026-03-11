import Invoice from '../../models/Invoice.js';
import Order from '../../models/Order.js';
import OrderDetail from '../../models/OrderDetail.js';
import InvoiceArchive from '../../models/InvoiceArchive.js';
import StatusTable from '../../models/StatusTable.js';

// Tạo hóa đơn mới
export const createInvoice = async (req, res) => {
    try {
        const { orderId, taxRate, discountRate, serviceChargeRate, paymentMethod, note } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin đơn hàng',
            });
        }

        // Lấy thông tin order
        const order = await Order.findById(orderId).populate('tableId');
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng',
            });
        }

        // Lấy chi tiết đơn hàng để tính subtotal
        const orderDetails = await OrderDetail.find({ orderId });
        const itemsSubtotal = orderDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Tạo invoice mới
        const invoice = new Invoice({
            orderId,
            tableId: order.tableId,
            itemsSubtotal,
            taxRate: taxRate || 0,
            discountRate: discountRate || 0,
            serviceChargeRate: serviceChargeRate || 0,
            paymentMethod: paymentMethod || 'cash',
            note: note || '',
        });

        // Tính tổng tiền
        invoice.calculateTotal();

        // Lưu invoice
        await invoice.save();

        res.status(201).json({
            success: true,
            message: 'Tạo hóa đơn thành công',
            data: invoice,
        });
    } catch (error) {
        console.error('Create invoice error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống khi tạo hóa đơn',
        });
    }
};

// Lấy danh sách hóa đơn
export const getInvoices = async (req, res) => {
    try {
        const { paymentStatus, tableId, startDate, endDate } = req.query;
        const filter = {};

        if (paymentStatus) {
            filter.paymentStatus = paymentStatus;
        }

        if (tableId) {
            filter.tableId = tableId;
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const invoices = await Invoice.find(filter).populate('orderId').populate('tableId').sort({ createdAt: -1 });

        // Lấy chi tiết items cho mỗi invoice
        const invoicesWithItems = await Promise.all(
            invoices.map(async (invoice) => {
                // gather orderIds from invoice.orderIds or invoice.orderId
                const ids =
                    invoice.orderIds && invoice.orderIds.length
                        ? invoice.orderIds
                        : invoice.orderId
                          ? [invoice.orderId._id || invoice.orderId]
                          : [];

                const orderDetails = await OrderDetail.find({ orderId: { $in: ids } }).populate('productId');
                return {
                    ...invoice.toObject(),
                    items: orderDetails,
                };
            }),
        );

        res.status(200).json({
            success: true,
            data: invoicesWithItems,
        });
    } catch (error) {
        console.error('Get invoices error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
        });
    }
};

// Lấy toàn bộ hóa đơn (cả hiện tại và đã lưu trữ)
export const getAllInvoices = async (req, res) => {
    try {
        // current invoices (pending/paid/...)
        const invoices = await Invoice.find().populate('orderId').populate('tableId').sort({ createdAt: -1 });

        // For each invoice, gather orderDetails items (if any)
        const invoicesWithItems = await Promise.all(
            invoices.map(async (inv) => {
                const ids =
                    inv.orderIds && inv.orderIds.length
                        ? inv.orderIds
                        : inv.orderId
                          ? [inv.orderId._id || inv.orderId]
                          : [];
                const orderDetails = await OrderDetail.find({ orderId: { $in: ids } }).populate('productId');

                return {
                    _id: inv._id,
                    source: 'current',
                    table: inv.tableId ? { _id: inv.tableId._id, name: inv.tableId.name || '' } : null,
                    orderIds: ids,
                    items: orderDetails.map((d) => ({
                        productId: d.productId?._id || null,
                        name: d.productId?.name || d.name || '',
                        quantity: d.quantity,
                        price: d.price,
                    })),
                    itemsSubtotal: inv.itemsSubtotal,
                    taxAmount: inv.taxAmount,
                    discountAmount: inv.discountAmount,
                    serviceCharge: inv.serviceCharge,
                    totalPrice: inv.totalPrice,
                    paymentMethod: inv.paymentMethod,
                    paymentStatus: inv.paymentStatus,
                    note: inv.note,
                    date: inv.createdAt,
                    createdAt: inv.createdAt,
                    updatedAt: inv.updatedAt,
                };
            }),
        );

        // archived invoices
        const archives = await InvoiceArchive.find().populate('tableId').sort({ paidAt: -1 });

        const normalizedArchives = archives.map((a) => ({
            _id: a._id,
            source: 'archive',
            table: a.tableId ? { _id: a.tableId._id, name: a.tableId.name || '' } : null,
            orderIds: a.orderIds || [],
            items: (a.items || []).map((it) => ({
                productId: it.productId || null,
                name: it.name || '',
                quantity: it.quantity,
                price: it.price,
            })),
            itemsSubtotal: a.itemsSubtotal,
            taxAmount: a.taxAmount,
            discountAmount: a.discountAmount,
            serviceCharge: a.serviceCharge,
            totalPrice: a.totalPrice,
            paymentMethod: a.paymentMethod,
            paymentStatus: a.paymentStatus,
            note: a.note,
            date: a.paidAt || a.createdAt,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
        }));

        // combine and sort by date desc
        const combined = [...invoicesWithItems, ...normalizedArchives].sort(
            (x, y) => new Date(y.date) - new Date(x.date),
        );

        res.status(200).json({ success: true, data: combined });
    } catch (error) {
        console.error('Get all invoices error:', error);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

// Lấy hóa đơn theo ID
export const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        // Try to find in current invoices
        const invoice = await Invoice.findById(id).populate('orderId').populate('tableId');

        if (invoice) {
            // gather orderIds and fetch details for all associated orders
            const ids =
                invoice.orderIds && invoice.orderIds.length
                    ? invoice.orderIds
                    : invoice.orderId
                      ? [invoice.orderId._id || invoice.orderId]
                      : [];

            const orderDetails = await OrderDetail.find({ orderId: { $in: ids } }).populate('productId');

            const items = orderDetails.map((d) => ({
                productId: d.productId?._id || null,
                name: d.productId?.name || d.name || '',
                quantity: d.quantity,
                price: d.price,
            }));

            return res.status(200).json({
                success: true,
                data: {
                    _id: invoice._id,
                    source: 'current',
                    table: invoice.tableId ? { _id: invoice.tableId._id, name: invoice.tableId.name || '' } : null,
                    orderIds: ids,
                    items,
                    itemsSubtotal: invoice.itemsSubtotal,
                    taxAmount: invoice.taxAmount,
                    discountAmount: invoice.discountAmount,
                    serviceCharge: invoice.serviceCharge,
                    totalPrice: invoice.totalPrice,
                    paymentMethod: invoice.paymentMethod,
                    paymentStatus: invoice.paymentStatus,
                    note: invoice.note,
                    date: invoice.createdAt,
                    createdAt: invoice.createdAt,
                    updatedAt: invoice.updatedAt,
                },
            });
        }

        // If not found in current invoices, try archive
        const archive = await InvoiceArchive.findById(id).populate('tableId');
        if (archive) {
            const items = (archive.items || []).map((it) => ({
                productId: it.productId || null,
                name: it.name || '',
                quantity: it.quantity,
                price: it.price,
            }));

            return res.status(200).json({
                success: true,
                data: {
                    _id: archive._id,
                    source: 'archive',
                    table: archive.tableId ? { _id: archive.tableId._id, name: archive.tableId.name || '' } : null,
                    orderIds: archive.orderIds || [],
                    items,
                    itemsSubtotal: archive.itemsSubtotal,
                    taxAmount: archive.taxAmount,
                    discountAmount: archive.discountAmount,
                    serviceCharge: archive.serviceCharge,
                    totalPrice: archive.totalPrice,
                    paymentMethod: archive.paymentMethod,
                    paymentStatus: archive.paymentStatus,
                    note: archive.note,
                    date: archive.paidAt || archive.createdAt,
                    createdAt: archive.createdAt,
                    updatedAt: archive.updatedAt,
                },
            });
        }

        return res.status(404).json({ success: false, message: 'Không tìm thấy hóa đơn' });
    } catch (error) {
        console.error('Get invoice error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
        });
    }
};

// Cập nhật hóa đơn
export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const invoice = await Invoice.findById(id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hóa đơn',
            });
        }

        // Cập nhật các trường
        Object.keys(updates).forEach((key) => {
            invoice[key] = updates[key];
        });

        // Tính lại tổng tiền nếu có thay đổi
        if (updates.taxRate || updates.discountRate || updates.serviceChargeRate || updates.itemsSubtotal) {
            invoice.calculateTotal();
        }

        await invoice.save();

        res.status(200).json({
            success: true,
            message: 'Cập nhật hóa đơn thành công',
            data: invoice,
        });
    } catch (error) {
        console.error('Update invoice error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
        });
    }
};

// Thanh toán hóa đơn
export const payInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentMethod } = req.body;

        const invoice = await Invoice.findById(id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hóa đơn',
            });
        }

        // gather order details for archive
        const ids =
            invoice.orderIds && invoice.orderIds.length ? invoice.orderIds : invoice.orderId ? [invoice.orderId] : [];
        const orderDetails = await OrderDetail.find({ orderId: { $in: ids } }).populate('productId');

        const items = orderDetails.map((od) => ({
            productId: od.productId?._id || null,
            name: od.productId?.name || od.name || '',
            quantity: od.quantity,
            price: od.price,
        }));

        // create archive record
        const archive = new InvoiceArchive({
            orderIds: invoice.orderIds || (invoice.orderId ? [invoice.orderId] : []),
            tableId: invoice.tableId,
            items,
            itemsSubtotal: invoice.itemsSubtotal,
            taxAmount: invoice.taxAmount,
            taxRate: invoice.taxRate,
            discountAmount: invoice.discountAmount,
            discountRate: invoice.discountRate,
            serviceCharge: invoice.serviceCharge,
            serviceChargeRate: invoice.serviceChargeRate,
            totalPrice: invoice.totalPrice,
            paymentMethod: paymentMethod || invoice.paymentMethod,
            paymentStatus: 'paid',
            note: invoice.note || '',
            paidAt: new Date(),
        });

        await archive.save();

        // remove the paid invoice (we have archived it)
        await Invoice.deleteOne({ _id: invoice._id });

        // set table status to empty
        try {
            const emptyStatus = await StatusTable.findOne({ code: 'empty' });
            if (invoice.tableId && emptyStatus) {
                const TableModel = await import('../../models/Table.js');
                await TableModel.default.findByIdAndUpdate(invoice.tableId, { statusId: emptyStatus._id });
            }
        } catch (e) {
            console.error('Failed to set table status to empty after payment:', e);
        }

        // Do NOT auto-create a new empty invoice here. New invoices should be
        // created when a customer sends their cart (client action). Returning
        // only the archived record.
        res.status(200).json({
            success: true,
            message: 'Thanh toán thành công',
            data: { archived: archive },
        });
    } catch (error) {
        console.error('Pay invoice error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
        });
    }
};

// Close pending invoice for a table (used when table logs out without paying)
export const closeInvoiceForTable = async (req, res) => {
    try {
        const { tableId } = req.body;

        if (!tableId) {
            return res.status(400).json({ success: false, message: 'Thiếu tableId' });
        }

        const invoice = await Invoice.findOne({ tableId, paymentStatus: 'pending' });
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Không có hóa đơn pending cho bàn này' });
        }

        invoice.paymentStatus = 'closed';
        await invoice.save();

        // set table status to empty
        try {
            const empty = await StatusTable.findOne({ code: 'empty' });
            if (empty) {
                const TableModel = await import('../../models/Table.js');
                await TableModel.default.findByIdAndUpdate(tableId, { statusId: empty._id });
            }
        } catch (e) {
            console.error('Failed to set table status to empty on close:', e);
        }

        res.status(200).json({ success: true, message: 'Hóa đơn đã được đóng' });
    } catch (error) {
        console.error('Close invoice error:', error);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

// Lấy tổng doanh thu
export const getRevenue = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const filter = { paymentStatus: 'paid' };

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const invoices = await Invoice.find(filter);

        const revenue = {
            totalRevenue: invoices.reduce((sum, inv) => sum + inv.totalPrice, 0),
            totalItemsSubtotal: invoices.reduce((sum, inv) => sum + inv.itemsSubtotal, 0),
            totalTax: invoices.reduce((sum, inv) => sum + inv.taxAmount, 0),
            totalDiscount: invoices.reduce((sum, inv) => sum + inv.discountAmount, 0),
            totalServiceCharge: invoices.reduce((sum, inv) => sum + inv.serviceCharge, 0),
            totalInvoices: invoices.length,
        };

        res.status(200).json({
            success: true,
            data: revenue,
        });
    } catch (error) {
        console.error('Get revenue error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
        });
    }
};
