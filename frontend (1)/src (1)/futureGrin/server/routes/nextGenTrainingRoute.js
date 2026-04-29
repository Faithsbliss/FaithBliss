import express from 'express';
import NextGenTraining from '../models/NextGenTraining.js';

const router = express.Router();

// POST /api/admin/training
router.post('/', async (req, res) => {
  try {
    const newInfo = new NextGenTraining(req.body);
    await newInfo.save();
    res.status(201).json(newInfo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/admin/training
router.get('/', async (req, res) => {
  try {
    const info = await NextGenTraining.find().sort({ createdAt: -1 });
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;