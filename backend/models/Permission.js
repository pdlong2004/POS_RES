import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
    code: String,
    description: String,
});

export default mongoose.model('Permission', permissionSchema);
