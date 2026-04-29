// src/nextgen/models/NextGenPress.js

import mongoose from 'mongoose';

const nextGenPressSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['pressRelease', 'mediaCoverage'],
    },
    title: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: function () {
            return this.type === 'pressRelease';
        },
    },
    summary: {
        type: String,
        required: function () {
            return this.type === 'pressRelease';
        },
    },
    details: {
        type: String,
        required: true,
    },
    outlet: {
        type: String,
        required: function () {
            return this.type === 'mediaCoverage';
        },
    },
});

const NextGenPress = mongoose.model('NextGenPress', nextGenPressSchema);

export default NextGenPress;