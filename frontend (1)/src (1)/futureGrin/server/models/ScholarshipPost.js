// models/ScholarshipPost.js
import mongoose from 'mongoose';

const scholarshipPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    excerpt: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    iconName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ScholarshipPost = mongoose.model('ScholarshipPost', scholarshipPostSchema);

export default ScholarshipPost;