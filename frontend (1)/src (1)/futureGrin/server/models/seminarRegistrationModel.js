// src/models/seminarRegistrationModel.js
import mongoose from 'mongoose';

const seminarRegistrationSchema = new mongoose.Schema({
    seminarId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seminar',
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    paymentReference: {
        type: String,
        unique: true,
        sparse: true,
    },
    registrationDate: {
        type: Date,
        default: Date.now,
    },
});

const SeminarRegistration = mongoose.model('SeminarRegistration', seminarRegistrationSchema);

export default SeminarRegistration;