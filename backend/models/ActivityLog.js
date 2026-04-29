import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    action: { type: String, required: true }, // CREATE, UPDATE, DELETE, LOGIN
    entity: { type: String, required: true }, // Staff, Product, Order, etc.
    entityId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: mongoose.Schema.Types.Mixed },
    ipAddress: String,
}, { timestamps: true });

export default mongoose.model('ActivityLog', activityLogSchema);
