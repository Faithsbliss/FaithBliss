// models/Post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
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
    // The icon can be a string that represents a specific icon name or class
    iconName: { 
        type: String,
        required: true,
    },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;