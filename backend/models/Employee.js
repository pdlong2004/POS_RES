import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    position: String,
    salary: Number,
});

export default mongoose.model('Employee', employeeSchema);
