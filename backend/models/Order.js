import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
        accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', default: null },
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', default: null },
        status: String,
        totalPrice: Number,
    },
    { timestamps: true },
);

export default mongoose.model('Order', orderSchema);
