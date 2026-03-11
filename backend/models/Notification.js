import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: { type: String, enum: ['order', 'booking', 'inventory'], required: true },
        isRead: { type: Boolean, default: false },
        link: { type: String }, // Optional link to redirect, e.g., /admin/orders
    },
    { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
