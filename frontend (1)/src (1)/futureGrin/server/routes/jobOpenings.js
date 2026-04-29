// server/routes/jobOpenings.js
import express from 'express';
import JobOpening from '../models/JobOpening.js';
import Admin from '../models/Admin.js'; // Assuming you have an Admin model for key validation

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

// Public GET route to fetch all published job openings
router.get('/', async (req, res) => {
    try {
        const openings = await JobOpening.find({ isPublished: true }).sort({ createdAt: -1 });
        res.status(200).json(openings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin-only POST route to create a new job opening
router.post('/', checkAdminKey, async (req, res) => {
    const { title, department, description, isPublished = true } = req.body;

    const newOpening = new JobOpening({
        title,
        department,
        description,
        isPublished
    });

    try {
        const savedOpening = await newOpening.save();
        res.status(201).json(savedOpening);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Admin-only PUT route to update a job opening
router.put('/:id', checkAdminKey, async (req, res) => {
    try {
        const updatedOpening = await JobOpening.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // 'new: true' returns the updated document, 'runValidators: true' runs schema validators on update
        );

        if (!updatedOpening) {
            return res.status(404).json({ message: 'Job opening not found.' });
        }

        res.json(updatedOpening);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Admin-only DELETE route to remove a job opening
router.delete('/:id', checkAdminKey, async (req, res) => {
    try {
        const deletedOpening = await JobOpening.findByIdAndDelete(req.params.id);

        if (!deletedOpening) {
            return res.status(404).json({ message: 'Job opening not found.' });
        }

        res.json({ message: 'Job opening successfully deleted.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;