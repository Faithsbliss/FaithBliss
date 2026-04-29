// src/models/webinarSchema.js
import mongoose from 'mongoose';

const webinarSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: String,
        required: true,
    },
    speaker: {
        type: String,
        required: true,
        trim: true,
    },
    desc: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: false, // Make it optional if some webinars are free
        default: 0,
    },
    isUpcoming: {
        type: Boolean,
        required: true,
    },
    videoUrl: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

const Webinar = mongoose.model('Webinar', webinarSchema);

export default Webinar;