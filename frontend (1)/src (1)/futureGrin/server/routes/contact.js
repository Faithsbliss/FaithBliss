import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Admin from '../models/Admin.js';
import ContactMessage from '../models/ContactMessage.js';

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

const checkAdminKey = async (req, res, next) => {
    const adminKey = req.headers['x-admin-key'];
    if (!adminKey) {
        return res.status(403).json({ message: 'Forbidden: Admin key is required.' });
    }

    try {
        const admin = await Admin.findOne({ adminKey });
        if (!admin) {
            return res.status(403).json({ message: 'Forbidden: Invalid admin key.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error during key validation.' });
    }
};

router.post('/', upload.array('attachments', 5), async (req, res) => {
    const { name, email, subject, message, source } = req.body || {};

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const safeSubject = subject && subject.trim() ? subject.trim() : 'New message';
    const locationTag = source ? ` (${source})` : '';

    let attachments = [];
    if (req.files && req.files.length > 0) {
        try {
            const uploadResults = await Promise.all(
                req.files.map((file) =>
                    cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
                        folder: 'futuregrin/contact',
                        resource_type: 'auto',
                        use_filename: true,
                        unique_filename: true,
                    })
                )
            );

            attachments = uploadResults.map((result, index) => ({
                originalName: req.files[index]?.originalname,
                filename: result.original_filename,
                url: result.secure_url,
                publicId: result.public_id,
                mimeType: req.files[index]?.mimetype,
                size: req.files[index]?.size,
            }));
        } catch (error) {
            console.error('Cloudinary upload error:', error?.message || error);
            return res.status(500).json({ message: 'Failed to upload attachments.' });
        }
    }

    try {
        await ContactMessage.create({
            name,
            email,
            subject: safeSubject,
            message,
            source: source || '',
            attachments,
        });
    } catch (error) {
        console.error('Contact message save error:', error?.message || error);
        return res.status(500).json({ message: 'Failed to save message.' });
    }

    return res.status(200).json({ message: 'Message sent successfully.' });
});

router.get('/messages', checkAdminKey, async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch messages.' });
    }
});

export default router;
