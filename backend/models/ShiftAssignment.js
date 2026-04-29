import mongoose from 'mongoose';

const shiftAssignmentSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    shiftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift', required: true },
    date: { type: Date, required: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    status: { type: String, enum: ['scheduled', 'absent', 'completed'], default: 'scheduled' }
}, { timestamps: true });

export default mongoose.model('ShiftAssignment', shiftAssignmentSchema);
