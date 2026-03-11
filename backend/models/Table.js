import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
    name: String,
    statusId: { type: mongoose.Schema.Types.ObjectId, ref: 'StatusTable' },
    direction: { type: String, unique: true },
    isDeleted: { type: Boolean, default: false },
});

export default mongoose.model('Table', tableSchema);
