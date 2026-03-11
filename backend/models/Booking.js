import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        customerName: { type: String, required: true },
        customerPhone: { type: String, required: true },
        numberOfGuests: { type: Number, required: true, min: 1, max: 30 },
        bookingDate: { type: Date, required: true },
        bookingTime: { type: String, required: true },
        tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', default: null },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
        note: { type: String, default: '' },
    },
    { timestamps: true },
);

export default mongoose.model('Booking', bookingSchema);
