import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: String,
        slug: String,
        order: Number,
        active: { type: Boolean, default: true },
        menuGroupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuGroup',
            required: false,
        },
    },
    { timestamps: true },
);

export default mongoose.model('Category', categorySchema);
