import express from 'express';
import Seminar from '../models/Seminar.js';
import Admin from '../models/Admin.js'; // Assumes you have an Admin model for key validation

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
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error during key validation.' });
    }
};

// GET public route: fetch all seminars
router.get('/', async (req, res) => {
    try {
        const seminars = await Seminar.find().sort({ createdAt: -1 }); // Sort by creation date, newest first
        res.status(200).json(seminars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin-only POST route: create a new seminar
router.post('/', checkAdminKey, async (req, res) => {
    // Destructure all fields, including the new 'price'
    const { title, date, time, location, description, image, price } = req.body;

    const newSeminar = new Seminar({
        title,
        date,
        time,
        location,
        description,
        image,
        price, // Include the price field here
    });

    try {
        const savedSeminar = await newSeminar.save();
        res.status(201).json(savedSeminar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Admin-only PUT route: update a seminar
router.put('/:id', checkAdminKey, async (req, res) => {
    try {
        const updatedSeminar = await Seminar.findByIdAndUpdate(
            req.params.id,
            req.body, // The entire req.body is used for updates, which handles the 'price' field
            { new: true, runValidators: true }
        );

        if (!updatedSeminar) {
            return res.status(404).json({ message: 'Seminar not found.' });
        }

        res.json(updatedSeminar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Admin-only DELETE route: delete a seminar
router.delete('/:id', checkAdminKey, async (req, res) => {
    try {
        const deletedSeminar = await Seminar.findByIdAndDelete(req.params.id);

        if (!deletedSeminar) {
            return res.status(404).json({ message: 'Seminar not found.' });
        }

        res.json({ message: 'Seminar successfully deleted.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;