import mongoose from 'mongoose';

const processSchema = new mongoose.Schema(
    {
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
        action: String,
    },
    { timestamps: true },
);

export default mongoose.model('Process', processSchema);
