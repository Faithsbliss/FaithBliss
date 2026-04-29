// routes/scholarships.js
import express from 'express';
import ScholarshipPost from '../models/ScholarshipPost.js';
import Admin from '../models/Admin.js'; // Assumes Admin model is used for key validation

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

// GET public route: fetch all scholarship posts
router.get('/', async (req, res) => {
    try {
        const posts = await ScholarshipPost.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin-only POST route: create a new scholarship post
router.post('/', checkAdminKey, async (req, res) => {
    const newPost = new ScholarshipPost(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Admin-only PUT route: update a scholarship post
router.put('/:id', checkAdminKey, async (req, res) => {
    try {
        const updatedPost = await ScholarshipPost.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Scholarship post not found.' });
        }

        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Admin-only DELETE route: delete a scholarship post
router.delete('/:id', checkAdminKey, async (req, res) => {
    try {
        const deletedPost = await ScholarshipPost.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Scholarship post not found.' });
        }

        res.json({ message: 'Scholarship post successfully deleted.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;