import express from 'express';
import MiniResult from '../models/MiniResult.js';
import Admin from '../models/Admin.js'; // Assuming Admin model is in this path

const router = express.Router();

// Reusing the admin key middleware
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

// POST route to create or update a mini-result (Admin only)
router.post('/', checkAdminKey, async (req, res) => {
    const { serviceTitle, content } = req.body;
    try {
        const result = await MiniResult.findOneAndUpdate(
            { serviceTitle },
            { serviceTitle, content },
            { upsert: true, new: true, runValidators: true }
        );
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET route to fetch a mini-result by service title (Public)
// This is the correct, simple, and reliable approach.
router.get('/:serviceTitle', async (req, res) => {
    try {
        // The client-side code already uses encodeURIComponent, so the parameter
        // will be received as a single string (e.g., "Target%20Identification").
        // decodeURIComponent is used here to get the original string with spaces.
        const serviceTitle = decodeURIComponent(req.params.serviceTitle);

        const result = await MiniResult.findOne({ serviceTitle });
        if (!result) {
            return res.status(404).json({ message: 'Mini result not found for this service.' });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;