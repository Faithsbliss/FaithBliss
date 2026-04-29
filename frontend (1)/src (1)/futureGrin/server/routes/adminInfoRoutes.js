import express from 'express';
import AdminInfo from '../models/AdminInfo.js';

const router = express.Router();

// POST /api/admin/info
router.post('/', async (req, res) => {
  try {
    const newInfo = new AdminInfo(req.body);
    await newInfo.save();
    res.status(201).json(newInfo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/admin/info
router.get('/', async (req, res) => {
  try {
    const info = await AdminInfo.find().sort({ createdAt: -1 });
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;