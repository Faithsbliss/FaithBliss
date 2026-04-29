import express from 'express';
import NextGenJob from '../models/NextGenJob.js';
import Admin from '../models/Admin.js'; // Assuming Admin model is in this path

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

// GET route to fetch all job openings (publicly accessible)
router.get('/', async (req, res) => {
    try {
        const jobs = await NextGenJob.find().sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST route to create a new job opening (admin only)
router.post('/', checkAdminKey, async (req, res) => {
    const { title, location, type, summary, details } = req.body;

    const newJob = new NextGenJob({
        title,
        location,
        type,
        summary,
        details,
    });

    try {
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT route to update a job opening (admin only)
router.put('/:id', checkAdminKey, async (req, res) => {
    try {
        const updatedJob = await NextGenJob.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedJob) {
            return res.status(404).json({ message: 'Job opening not found.' });
        }

        res.json(updatedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE route to delete a job opening (admin only)
router.delete('/:id', checkAdminKey, async (req, res) => {
    try {
        const deletedJob = await NextGenJob.findByIdAndDelete(req.params.id);

        if (!deletedJob) {
            return res.status(404).json({ message: 'Job opening not found.' });
        }

        res.json({ message: 'Job opening successfully deleted.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;