// models/trainingRegistrationModel.js
import mongoose from 'mongoose';

const trainingRegistrationSchema = new mongoose.Schema({
    trainingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Training',
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    paymentReference: {
        type: String,
        required: true,
        unique: true
    },
    // The date of registration, automatically managed by `timestamps`
}, { timestamps: true });

const TrainingRegistration = mongoose.model('TrainingRegistration', trainingRegistrationSchema);

export default TrainingRegistration;