import express from 'express';
import NextGenNews from '../models/NextGenNews.js';
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

// GET route to fetch all NextGen news posts
router.get('/', async (req, res) => {
    try {
        const news = await NextGenNews.find().sort({ createdAt: -1 });
        res.status(200).json(news);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST route to create a new NextGen news post
// This route is protected by the checkAdminKey middleware
router.post('/', checkAdminKey, async (req, res) => {
    const { category, title, date, summary, content } = req.body;
    const newPost = new NextGenNews({
        category,
        title,
        date,
        summary,
        content
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;