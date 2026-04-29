// routes/trainings.js
import express from 'express';
import Training from '../models/Training.js';
import Admin from '../models/Admin.js'; // Assumes you have an Admin model for key validation
import TrainingRegistration from '../models/trainingRegistrationModel.js'; // <-- Add this

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

// GET public route: fetch all training posts, sorted by creation date
router.get('/', async (req, res) => {
    try {
        const trainings = await Training.find().sort({ createdAt: -1 });
        res.status(200).json(trainings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin-only POST route: create a new training post
router.post('/', checkAdminKey, async (req, res) => {
    // Destructure all fields, including the new 'price'
    const { title, date, time, location, description, image, price } = req.body;

    const newTraining = new Training({
        title,
        date,
        time,
        location,
        description,
        image,
        price, // Include the price field here
    });

    try {
        const savedTraining = await newTraining.save();
        res.status(201).json(savedTraining);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Admin-only PUT route: update a training post
router.put('/:id', checkAdminKey, async (req, res) => {
    try {
        const updatedTraining = await Training.findByIdAndUpdate(
            req.params.id,
            req.body, // The entire req.body is used for updates, which handles the 'price' field
            { new: true, runValidators: true }
        );

        if (!updatedTraining) {
            return res.status(404).json({ message: 'Training post not found.' });
        }

        res.json(updatedTraining);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Admin-only DELETE route: delete a training post
router.delete('/:id', checkAdminKey, async (req, res) => {
    try {
        const deletedTraining = await Training.findByIdAndDelete(req.params.id);

        if (!deletedTraining) {
            return res.status(404).json({ message: 'Training post not found.' });
        }

        res.json({ message: 'Training post successfully deleted.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to get specific registration details (optional)
router.get('/registrations/:trainingId', checkAdminKey, async (req, res) => {
    try {
        const registrations = await TrainingRegistration.find({ trainingId: req.params.trainingId }).populate('trainingId', 'title');
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router;