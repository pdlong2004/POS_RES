import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
    {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        orderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
        tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },

        // Phân tổng hóa đơn (Subtotal breakdown)
        itemsSubtotal: { type: Number, required: true, default: 0 }, // Tổng tiền món ăn
        taxAmount: { type: Number, default: 0 }, // Thuế VAT
        taxRate: { type: Number, default: 0 }, // Tỷ lệ thuế (%)
        discountAmount: { type: Number, default: 0 }, // Giảm giá
        discountRate: { type: Number, default: 0 }, // Tỷ lệ giảm giá (%)
        serviceCharge: { type: Number, default: 0 }, // Phí phục vụ
        serviceChargeRate: { type: Number, default: 0 }, // Tỷ lệ phí phục vụ (%)

        totalPrice: { type: Number, required: true }, // Tổng cộng cuối cùng
        paymentMethod: { type: String, enum: ['cash', 'card', 'transfer', 'vnpay', 'other'], default: 'cash' },
        paymentStatus: { type: String, enum: ['pending', 'paid', 'cancelled', 'closed'], default: 'pending' },

        // Tracking VNPay
        vnp_TxnRef: { type: String }, // Mã tham chiếu giao dịch (Mã đơn hàng)
        vnp_TransactionNo: { type: String }, // Mã giao dịch tại VNPAY
        vnp_BankCode: { type: String }, // Mã ngân hàng thanh toán
        vnp_PayDate: { type: String }, // Thời gian thanh toán
        vnp_ResponseCode: { type: String }, // Mã phản hồi kết quả giao dịch

        note: { type: String, default: '' }, // Ghi chú
    },
    { timestamps: true },
);

// Virtual để tính tổng tự động (nếu cần)
invoiceSchema.virtual('calculatedTotal').get(function () {
    return this.itemsSubtotal + this.taxAmount + this.serviceCharge - this.discountAmount;
});

// Method để cập nhật tổng tiền
invoiceSchema.methods.calculateTotal = function () {
    // Tính thuế
    if (this.taxRate > 0) {
        this.taxAmount = (this.itemsSubtotal * this.taxRate) / 100;
    }

    // Tính phí phục vụ
    if (this.serviceChargeRate > 0) {
        this.serviceCharge = (this.itemsSubtotal * this.serviceChargeRate) / 100;
    }

    // Tính giảm giá
    if (this.discountRate > 0) {
        this.discountAmount = (this.itemsSubtotal * this.discountRate) / 100;
    }

    // Tính tổng cuối cùng
    this.totalPrice = this.itemsSubtotal + this.taxAmount + this.serviceCharge - this.discountAmount;

    return this.totalPrice;
};

export default mongoose.model('Invoice', invoiceSchema);
