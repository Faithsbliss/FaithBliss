// models/FaithPost.js
import mongoose from 'mongoose';

const faithPostSchema = new mongoose.Schema({
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
    // The URL for the post's image
    image: {
        type: String,
        required: true,
    },
    // You can also add these fields if you want to store them in the database
    author: {
        type: String,
        default: 'Admin',
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const FaithPost = mongoose.model('FaithPost', faithPostSchema);

export default FaithPost;