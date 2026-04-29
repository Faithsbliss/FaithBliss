import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AdminInfo from '../models/AdminInfo.js';

const router = express.Router();

// --- File Upload Configuration ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create separate directories for different file types
        let dest = 'uploads/';
        if (file.fieldname === 'miniReportFile') {
            dest = 'uploads/mini-reports/';
        } else if (file.fieldname === 'fullReportFile') {
            dest = 'uploads/full-reports/';
        } else {
            // Fallback for unexpected field names, although Multer should prevent this
            dest = 'uploads/general/';
        }

        // Ensure the directory exists. Create it recursively if it doesn't.
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        // Use the title from the URL to create a clean, identifiable filename
        const title = req.params.title || 'untitled';
        const decodedTitle = decodeURIComponent(title);
        const cleanTitle = decodedTitle.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s/g, '_');
        const fileExtension = path.extname(file.originalname);

        // Append a timestamp to the filename to ensure uniqueness
        const uniqueFilename = `${cleanTitle}-${Date.now()}${fileExtension}`;
        cb(null, uniqueFilename);
    }
});

const upload = multer({ storage: storage });

// --- API Endpoint for Uploading Mini Report File ---
// POST /api/upload/mini-report/:title
router.post('/mini-report/:title', upload.single('miniReportFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Use the relative path to the file from the root
        const fileUrl = path.join('/', req.file.destination, req.file.filename).replace(/\\/g, '/');

        const { title } = req.params;
        const decodedTitle = decodeURIComponent(title);

        const adminInfo = await AdminInfo.findOneAndUpdate(
            { title: decodedTitle },
            { $set: { miniReportFileUrl: fileUrl } },
            { new: true, upsert: true }
        );

        res.status(201).json({
            message: 'Mini report file uploaded and linked successfully.',
            fileUrl: fileUrl,
            updatedAdminInfo: adminInfo
        });
    } catch (error) {
        console.error('Error uploading mini report:', error);
        res.status(500).json({ message: error.message });
    }
});

// --- API Endpoint for Uploading Full Report File ---
// POST /api/upload/full-report/:title
router.post('/full-report/:title', upload.single('fullReportFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const fileUrl = path.join('/', req.file.destination, req.file.filename).replace(/\\/g, '/');
        
        const { title } = req.params;
        const decodedTitle = decodeURIComponent(title);

        const adminInfo = await AdminInfo.findOneAndUpdate(
            { title: decodedTitle },
            { $set: { fullReportFileUrl: fileUrl } },
            { new: true, upsert: true }
        );

        res.status(201).json({
            message: 'Full report file uploaded and linked successfully.',
            fileUrl: fileUrl,
            updatedAdminInfo: adminInfo
        });
    } catch (error) {
        console.error('Error uploading full report:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;