import mongoose from 'mongoose';

const rankSchema = new mongoose.Schema({
    name: String,
    minPoint: Number,
    discountPercent: Number,
});

export default mongoose.model('Rank', rankSchema);
