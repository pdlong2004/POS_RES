import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    image: String,
    stock_quantity: { type: Number, default: 0 },
});

export default mongoose.model('Product', productSchema);
