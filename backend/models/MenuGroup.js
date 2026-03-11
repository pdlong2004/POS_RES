import mongoose from 'mongoose';

const menuGroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('MenuGroup', menuGroupSchema);
