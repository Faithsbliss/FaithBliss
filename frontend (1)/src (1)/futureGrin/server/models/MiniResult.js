import mongoose from 'mongoose';

const miniResultSchema = new mongoose.Schema({
    serviceTitle: {
        type: String,
        required: true,
        unique: true, // Ensures only one mini-result per service
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const MiniResult = mongoose.model('MiniResult', miniResultSchema);
export default MiniResult;