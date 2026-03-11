import mongoose from 'mongoose';

const statusProductSchema = new mongoose.Schema({
    name: String,
});

export default mongoose.model('StatusProduct', statusProductSchema);
