// routes/news.js
import express from 'express';
import News from '../models/News.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Middleware to check for a secret admin key
const checkAdminKey = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey && adminKey === process.env.ADMIN_KEY) {
    next(); // Proceed to the next middleware/route handler
  } else {
    res.status(403).json({ message: 'Forbidden: Invalid admin key' });
  }
};

// GET all news posts (Publicly accessible)
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new news post (Protected by the admin key)
router.post('/', checkAdminKey, async (req, res) => {
  const newsPost = new News({
    category: req.body.category,
    title: req.body.title,
    date: req.body.date,
    summary: req.body.summary,
    content: req.body.content,
  });

  try {
    const newPost = await newsPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;