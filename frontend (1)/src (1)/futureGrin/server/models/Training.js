import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: String, // Storing as String for simpler handling with date-picker inputs
        required: true,
    },
    time: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL to the training image
        required: true,
    },
    price: {
        type: Number,
        required: true, // Make price a required field
        min: 0, // Ensure the price is a non-negative number
    },
    // Optional, automatically managed fields
    author: {
        type: String,
        default: 'Admin',
    },
    // The date of post creation, automatically managed by `timestamps`
}, { timestamps: true });

const Training = mongoose.model('Training', trainingSchema);

export default Training;