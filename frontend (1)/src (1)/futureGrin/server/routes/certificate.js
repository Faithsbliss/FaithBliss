// src/routes/certificate.js
import express from 'express';
import Certificate from '../models/Certificate.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const generateCertificateDetails = (id) => {
    const baseDomain = process.env.FRONTEND_DOMAIN || 'http://localhost:5173'; 
    return {
        certificateId: id,
        verificationUrl: `${baseDomain}/verify-certificate?id=${id}`,
    };
};

// POST /api/certificate/issue
router.post('/issue', async (req, res) => {
    try {
        const { studentName, awardTitle, courseDetails, directorSignature } = req.body;
        const uniqueId = uuidv4().substring(0, 8).toUpperCase();
        const { verificationUrl } = generateCertificateDetails(uniqueId);

        const newCertificate = new Certificate({ 
            studentName, awardTitle, courseDetails, directorSignature,
            certificateId: uniqueId, verificationUrl,
        });

        await newCertificate.save();
        res.status(201).json(newCertificate);
    } catch (error) {
        console.error('Issue certificate error', error);
        res.status(400).json({ message: error.message });
    }
});

// GET /api/certificate/verify/:id
router.get('/verify/:id', async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.id });
        if (!certificate) return res.status(404).json({ isValid: false, message: 'Certificate ID not found.' });

        res.status(200).json({
            isValid: true,
            studentName: certificate.studentName,
            awardTitle: certificate.awardTitle,
            courseDetails: certificate.courseDetails,
            issueDate: certificate.issueDate,
            verificationUrl: certificate.verificationUrl,
        });
    } catch (error) {
        console.error('Verification error', error);
        res.status(500).json({ message: 'Verification failed due to a server error.' });
    }
});

export default router;
