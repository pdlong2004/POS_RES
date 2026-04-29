import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Morning, Afternoon, Night
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true }, // HH:mm
    color: { type: String, default: '#3b82f6' } // For UI calendar
}, { timestamps: true });

export default mongoose.model('Shift', shiftSchema);
