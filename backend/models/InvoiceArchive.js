import mongoose from 'mongoose';

const invoiceArchiveSchema = new mongoose.Schema(
    {
        orderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
        tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                name: String,
                quantity: Number,
                price: Number,
            },
        ],
        itemsSubtotal: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        taxRate: { type: Number, default: 0 },
        discountAmount: { type: Number, default: 0 },
        discountRate: { type: Number, default: 0 },
        serviceCharge: { type: Number, default: 0 },
        serviceChargeRate: { type: Number, default: 0 },
        totalPrice: { type: Number, default: 0 },
        paymentMethod: { type: String, default: 'cash' },
        paymentStatus: { type: String, default: 'paid' },
        note: { type: String, default: '' },
        paidAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

export default mongoose.model('InvoiceArchive', invoiceArchiveSchema);
