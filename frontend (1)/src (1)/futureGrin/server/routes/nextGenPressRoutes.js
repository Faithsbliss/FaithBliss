import express from 'express';
import NextGenPress from '../models/NextGenPress.js';
import Admin from '../models/Admin.js'; // Adjust path as necessary based on your file structure

const router = express.Router();

// Middleware to check for a valid admin key
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
        next(); // Key is valid, proceed
    } catch (err) {
        res.status(500).json({ message: 'Server error during key validation.' });
    }
};

// GET route to fetch all NextGen press and media content
router.get('/', async (req, res) => {
    try {
        const pressData = await NextGenPress.find().sort({ createdAt: -1 });
        const pressReleases = pressData.filter(item => item.type === 'pressRelease');
        const mediaCoverage = pressData.filter(item => item.type === 'mediaCoverage');

        res.status(200).json({
            pressReleases,
            mediaCoverage,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST route to create a new NextGen press post (protected by admin key)
router.post('/', checkAdminKey, async (req, res) => {
    const { type, title, date, summary, details, outlet } = req.body;

    const newPost = new NextGenPress({
        type,
        title,
        date,
        summary,
        details,
        outlet,
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;