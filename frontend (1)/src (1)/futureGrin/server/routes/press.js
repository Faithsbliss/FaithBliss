import express from 'express';
import Press from '../models/Press.js';
import Admin from '../models/Admin.js'; // Import the Admin model for key validation

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

// GET route to fetch all press-related posts
router.get('/', async (req, res) => {
    try {
        const pressData = await Press.find().sort({ createdAt: -1 });
        const pressReleases = pressData.filter(item => item.type === 'pressRelease');
        const newsHighlights = pressData.filter(item => item.type === 'newsHighlight');
        const awards = pressData.filter(item => item.type === 'award');

        res.status(200).json({
            pressReleases,
            newsHighlights,
            awards
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST route to create a new press post (protected by admin key)
router.post('/', checkAdminKey, async (req, res) => {
    const { type, title, date, link, year, award } = req.body;

    const newPost = new Press({
        type,
        title,
        date,
        link,
        year,
        award
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;