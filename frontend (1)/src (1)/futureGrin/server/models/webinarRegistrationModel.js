// src/models/webinarRegistrationModel.js
import mongoose from 'mongoose';

const webinarRegistrationSchema = new mongoose.Schema({
    webinarId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Webinar'
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: false,
    },
    paymentReference: {
        type: String,
        required: true,
        unique: true, // Prevents duplicate entries for the same transaction
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
});

const WebinarRegistration = mongoose.model('WebinarRegistration', webinarRegistrationSchema);

export default WebinarRegistration;