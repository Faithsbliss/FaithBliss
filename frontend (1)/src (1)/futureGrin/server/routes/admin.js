// server/routes/admin.js
import express from 'express';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Route to create the first admin.
// This should be for internal use and removed after the admin is created.
router.post('/create-first-admin', async (req, res) => {
    // A simple, hard-coded secret to prevent public access to this route
    if (req.body.setupKey !== process.env.SETUP_KEY) {
        return res.status(403).json({ message: 'Forbidden: Invalid setup key' });
    }

    try {
        const { username, adminKey } = req.body;
        // Check if an admin with this key or username already exists
        const existingAdmin = await Admin.findOne({ $or: [{ username }, { adminKey }] });
        if (existingAdmin) {
            return res.status(409).json({ message: 'Admin with this username or key already exists.' });
        }
        
        const newAdmin = new Admin({ username, adminKey });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin account created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// New POST route to validate an existing admin key
router.post('/validate-key', async (req, res) => {
    try {
        const { adminKey } = req.body;
        // Find an admin with the provided key
        const admin = await Admin.findOne({ adminKey });
        
        if (admin) {
            // Key is valid
            res.status(200).json({ message: 'Admin key is valid.' });
        } else {
            // Key is not found in the database
            res.status(403).json({ message: 'Invalid admin key.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

export default router;