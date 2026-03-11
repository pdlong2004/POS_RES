import mongoose from 'mongoose';

const statusTableSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            enum: ['empty', 'occupied', 'reserved'],
        },
        name: {
            type: String,
            required: true,
        },
        color: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('StatusTable', statusTableSchema);
