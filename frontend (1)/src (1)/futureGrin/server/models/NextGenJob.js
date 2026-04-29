import mongoose from 'mongoose';

const nextGenJobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const NextGenJob = mongoose.model('NextGenJob', nextGenJobSchema);

export default NextGenJob;