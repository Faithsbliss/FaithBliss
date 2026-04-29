import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        subject: { type: String, default: 'New message' },
        message: { type: String, required: true },
        source: { type: String, default: '' },
        attachments: [
            {
                originalName: { type: String },
                filename: { type: String },
                path: { type: String },
                url: { type: String },
                publicId: { type: String },
                mimeType: { type: String },
                size: { type: Number },
            },
        ],
    },
    { timestamps: true }
);

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
