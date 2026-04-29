import express from 'express';
import NextGenLeadReport from '../models/NextGenLeadReport.js';

const router = express.Router();

// POST /api/admin/lead-report
router.post('/', async (req, res) => {
  try {
    const newInfo = new NextGenLeadReport(req.body);
    await newInfo.save();
    res.status(201).json(newInfo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/admin/lead-report
router.get('/', async (req, res) => {
  try {
    const info = await NextGenLeadReport.find().sort({ createdAt: -1 });
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;