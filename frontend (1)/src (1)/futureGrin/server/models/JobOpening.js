// server/models/JobOpening.js
import mongoose from 'mongoose';

const jobOpeningSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const JobOpening = mongoose.model('JobOpening', jobOpeningSchema);
export default JobOpening;