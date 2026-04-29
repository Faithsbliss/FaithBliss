// server/routes/NextGenpublicationRoutes.js
import express from 'express';
import Publication from '../models/NextGenPublication.js';
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

// GET route to fetch all publications
router.get('/', async (req, res) => {
  try {
    const publications = await Publication.find().sort({ createdAt: -1 });
    res.status(200).json(publications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST route to create a new publication (protected by admin key)
router.post('/', checkAdminKey, async (req, res) => {
  const { title, date, summary, details, link } = req.body;

  const newPublication = new Publication({
    title,
    date,
    summary,
    details,
    link,
  });

  try {
    const savedPublication = await newPublication.save();
    res.status(201).json(savedPublication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE route to delete a publication by ID (protected)
router.delete('/:id', checkAdminKey, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPublication = await Publication.findByIdAndDelete(id);
    if (!deletedPublication) {
      return res.status(404).json({ message: 'Publication not found' });
    }
    res.status(200).json({ message: 'Publication deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;