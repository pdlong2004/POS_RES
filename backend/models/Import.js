import mongoose from 'mongoose';

const importSchema = new mongoose.Schema(
    {
        supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
        totalPrice: Number,
    },
    { timestamps: true },
);

export default mongoose.model('Import', importSchema);
