// /models/Publication.js
import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['paper', 'patent', 'bookChapter'],
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    authors: {
        type: String,
        required: true,
        trim: true,
    },
    journal: {
        type: String,
        required: function() { return this.type === 'paper'; },
        trim: true,
    },
    patentNumber: {
        type: String,
        required: function() { return this.type === 'patent'; },
        trim: true,
    },
    bookTitle: {
        type: String,
        required: function() { return this.type === 'bookChapter'; },
        trim: true,
    },
    year: {
        type: Number,
        required: true,
    },
    link: {
        type: String,
        trim: true,
    }
}, { timestamps: true });

const Publication = mongoose.model('Publication', publicationSchema);

export default Publication;