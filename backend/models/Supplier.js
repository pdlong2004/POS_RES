import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactPerson: String,
    phone: String,
    email: String,
    address: String,
    taxCode: String,
    status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Supplier', supplierSchema);
