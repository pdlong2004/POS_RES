import mongoose from 'mongoose';

const importDetailSchema = new mongoose.Schema({
    importId: { type: mongoose.Schema.Types.ObjectId, ref: 'Import' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number,
});

export default mongoose.model('ImportDetail', importDetailSchema);
