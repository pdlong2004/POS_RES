import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
    {
        name: String,
        phone: String,
        email: String,
        password: String,
        roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
        rankId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rank' },
        point: { type: Number, default: 0 },
        status: { type: Boolean, default: true },
    },
    { timestamps: true },
);

export default mongoose.model('Account', accountSchema);
