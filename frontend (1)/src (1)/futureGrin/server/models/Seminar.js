// src/models/seminarSchema.js
import mongoose from 'mongoose';

const seminarSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    // Added new price field
    price: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Seminar = mongoose.model('Seminar', seminarSchema);

export default Seminar;