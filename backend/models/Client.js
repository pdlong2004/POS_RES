import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    name: String,
    phone: String,
    note: String,
});

export default mongoose.model('Client', clientSchema);
