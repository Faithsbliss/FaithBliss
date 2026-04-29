// src/nextgen/routes/runningAnalysisRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import RunningAnalysis from '../models/RunningAnalysis.js';

const router = express.Router();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Make sure the 'uploads' folder exists in your project root
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Use a unique name to prevent collisions
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST route for creating/updating running analysis data with file uploads
// The route here should match the endpoint in NextGenAdmin.jsx: '/admin/running-analysis'
// So in your server file, you'd likely do:
// import runningAnalysisRoutes from './routes/runningAnalysisRoutes.js';
// app.use('/api/admin/running-analysis', runningAnalysisRoutes); // If this is the correct structure
router.post('/', upload.fields([
  { name: 'miniReportFile', maxCount: 1 },
  { name: 'fullReportFile', maxCount: 1 },
]), async (req, res) => {
  try {
    console.log('Running Analysis POST request received.');
    console.log('Request Body:', req.body); // Log the parsed body
    console.log('Request Files:', req.files); // Log the files parsed by multer

    const { title, description, icon } = req.body;
    let miniReportFileUrl = null;
    let fullReportFileUrl = null;

    // Ensure files exist before accessing them
    if (req.files && req.files.miniReportFile && req.files.miniReportFile.length > 0) {
      miniReportFileUrl = `/uploads/${req.files.miniReportFile[0].filename}`;
      console.log('Mini Report File URL:', miniReportFileUrl);
    } else {
      console.log('No miniReportFile found or processed.');
    }

    if (req.files && req.files.fullReportFile && req.files.fullReportFile.length > 0) {
      fullReportFileUrl = `/uploads/${req.files.fullReportFile[0].filename}`;
      console.log('Full Report File URL:', fullReportFileUrl);
    } else {
      console.log('No fullReportFile found or processed.');
    }

    // --- VALIDATION ---
    // Check if required fields are present in req.body
    if (!title) {
      console.error('Validation Error: Title is missing.');
      return res.status(400).json({ message: 'Validation failed: title is required.' });
    }
    if (!description) {
      console.error('Validation Error: Description is missing.');
      return res.status(400).json({ message: 'Validation failed: description is required.' });
    }
    if (!icon) {
      console.error('Validation Error: Icon is missing.');
      return res.status(400).json({ message: 'Validation failed: icon is required.' });
    }
    // --- END VALIDATION ---


    // Check if the service title already exists to either update or create
    const existingAnalysis = await RunningAnalysis.findOne({ title });

    if (existingAnalysis) {
      // Update existing document
      existingAnalysis.description = description;
      existingAnalysis.icon = icon;
      if (miniReportFileUrl) existingAnalysis.miniReportFileUrl = miniReportFileUrl;
      if (fullReportFileUrl) existingAnalysis.fullReportFileUrl = fullReportFileUrl;

      await existingAnalysis.save();
      console.log('Updated existing Running Analysis:', existingAnalysis);
      res.status(200).json(existingAnalysis);
    } else {
      // Create new document
      const newAnalysis = new RunningAnalysis({
        title,
        description,
        icon,
        miniReportFileUrl,
        fullReportFileUrl,
      });

      await newAnalysis.save();
      console.log('Created new Running Analysis:', newAnalysis);
      res.status(201).json(newAnalysis);
    }
  } catch (error) {
    console.error('Error in Running Analysis POST handler:', error.message);
    // Ensure all error responses are consistent
    res.status(error.statusCode || 400).json({ message: error.message });
  }
});

// GET route for fetching all running analysis data
router.get('/', async (req, res) => {
  try {
    const analysis = await RunningAnalysis.find().sort({ createdAt: -1 });
    console.log('Fetched all Running Analysis entries:', analysis);
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error fetching Running Analysis data:', error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;