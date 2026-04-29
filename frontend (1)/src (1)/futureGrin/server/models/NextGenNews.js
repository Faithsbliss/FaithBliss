import mongoose from 'mongoose';

const NextGenNewsSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true,
        trim: true
    },
    summary: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true });

const NextGenNews = mongoose.model('NextGenNews', NextGenNewsSchema);
export default NextGenNews;