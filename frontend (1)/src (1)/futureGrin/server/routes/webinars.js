// routes/webinars.js
import express from 'express';
import Webinar from '../models/Webinar.js';
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

// GET public route: fetch all webinars
router.get('/', async (req, res) => {
    try {
        const webinars = await Webinar.find().sort({ createdAt: -1 });
        res.status(200).json(webinars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin-only POST route: create a new webinar
router.post('/', checkAdminKey, async (req, res) => {
    // 1. Destructure the price field from the request body
    const { title, date, speaker, desc, price, isUpcoming, videoUrl } = req.body;
    
    const newWebinar = new Webinar({
        title,
        date,
        speaker,
        price, // 2. Add price to the new Webinar object
        desc: isUpcoming ? desc : undefined,
        isUpcoming,
        videoUrl: isUpcoming ? undefined : videoUrl,
    });

    try {
        const savedWebinar = await newWebinar.save();
        res.status(201).json(savedWebinar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Admin-only PUT route: update a webinar
router.put('/:id', checkAdminKey, async (req, res) => {
    try {
        const updatedWebinar = await Webinar.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedWebinar) {
            return res.status(404).json({ message: 'Webinar not found.' });
        }

        res.json(updatedWebinar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Admin-only DELETE route: delete a webinar
router.delete('/:id', checkAdminKey, async (req, res) => {
    try {
        const deletedWebinar = await Webinar.findByIdAndDelete(req.params.id);

        if (!deletedWebinar) {
            return res.status(404).json({ message: 'Webinar not found.' });
        }

        res.json({ message: 'Webinar successfully deleted.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;