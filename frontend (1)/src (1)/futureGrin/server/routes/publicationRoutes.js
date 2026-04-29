// /routes/publicationRoutes.js
import express from 'express';
import Publication from '../models/Publication.js';
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

// Route to create a new publication post (protected by admin key)
router.post('/', checkAdminKey, async (req, res) => {
    try {
        const newPublication = new Publication(req.body);
        await newPublication.save();
        res.status(201).json({ message: 'Publication created successfully', publication: newPublication });
    } catch (error) {
        res.status(400).json({ message: 'Failed to create publication', error: error.message });
    }
});

// Route to get all publications
router.get('/', async (req, res) => {
    try {
        const publications = await Publication.find().sort({ year: -1, createdAt: -1 });
        res.status(200).json(publications);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch publications', error: error.message });
    }
});

export default router;