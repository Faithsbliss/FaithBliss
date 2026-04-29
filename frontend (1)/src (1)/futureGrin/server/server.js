import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for serving static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import your route files
import newsRoutes from './routes/news.js';
import adminRoutes from './routes/admin.js';
import nextgenNewsRoutes from './routes/nextgenNews.js';
import pressRoutes from './routes/press.js';
import nextGenPressRoutes from './routes/nextGenPressRoutes.js';
import publicationRoutes from './routes/publicationRoutes.js';
import nextGenPublicationRoutes from './routes/nextGenPublicationRoutes.js';
import jobOpeningsRoutes from './routes/jobOpenings.js';
import nextGenJobRoutes from './routes/nextGenJobRoutes.js';
import blogRoutes from './routes/blog.js';
import scholarshipsRoutes from './routes/scholarships.js';
import faithRoutes from './routes/faith.js';
import webinarsRoutes from './routes/webinars.js';
import seminarsRoutes from './routes/seminars.js';
import trainingsRoutes from './routes/trainings.js';
import webinarRegistrationModel from './models/webinarRegistrationModel.js';
import seminarRegistrationModel from './models/seminarRegistrationModel.js';
import Training from './models/Training.js';
import miniResultRoutes from './routes/miniResultRoutes.js';
import trainingRegistrationModel from './models/trainingRegistrationModel.js';
import adminInfoRoutes from './routes/adminInfoRoutes.js';
import runningAnalysisRoute from './routes/runningAnalysisRoute.js';
import nextGenLeadReportRoute from './routes/nextGenLeadReportRoute.js'
import nextGenTrainingRoute from './routes/nextGenTrainingRoute.js'
import uploadRoutes from './routes/uploadRoutes.js';
import certificateRoutes from './routes/certificate.js'; // <= Use this name for the issuance/verification routes
import certificateGenerationRoutes from './routes/certificateGeneration.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_CONNECT_MAX_RETRIES = Number(process.env.MONGODB_CONNECT_MAX_RETRIES || 5);
const MONGODB_CONNECT_RETRY_DELAY_MS = Number(process.env.MONGODB_CONNECT_RETRY_DELAY_MS || 5000);

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://futuregrin.vercel.app',
    'https://www.futuregrin.com',

];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(express.json());

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectToMongoDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined.');
    }

    for (let attempt = 1; attempt <= MONGODB_CONNECT_MAX_RETRIES; attempt += 1) {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            return;
        } catch (err) {
            if (attempt === MONGODB_CONNECT_MAX_RETRIES) {
                throw err;
            }

            console.error(`MongoDB connection attempt ${attempt} failed. Retrying in ${MONGODB_CONNECT_RETRY_DELAY_MS}ms...`, err);
            await wait(MONGODB_CONNECT_RETRY_DELAY_MS);
        }
    }
};

// Connect to MongoDB
connectToMongoDB().then(() => startHttpServer())
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Could not connect to MongoDB:', err));

// Define a simple health check route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'News Backend is running smoothly!' });
});

// Paystack Initialization and Verification Endpoints
app.post('/api/paystack/initiate-training-payment', async (req, res) => {
    const { trainingId, email, fullName, phone, amount } = req.body;
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    const amountInKobo = amount * 100;

    if (!PAYSTACK_SECRET_KEY) {
        console.error("Paystack Secret Key is not defined.");
        return res.status(500).json({ success: false, message: 'Server configuration error.' });
    }

    try {
        const paystackResponse = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: amountInKobo,
                metadata: {
                    trainingId,
                    fullName,
                    phone
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(200).json(paystackResponse.data.data);
    } catch (error) {
        console.error("Paystack initiation error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
});

// Paystack Verification Endpoint for Trainings
app.post('/api/verify-training-payment', async (req, res) => {
    const { reference, email, fullName, phone, trainingId, amount } = req.body;
    
    if (!reference || !amount) {
        return res.status(400).json({ success: false, message: 'Payment reference or amount is missing.' });
    }

    try {
        const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
        if (!PAYSTACK_SECRET_KEY) {
            console.error("Paystack Secret Key is not defined.");
            return res.status(500).json({ success: false, message: 'Server configuration error.' });
        }
        
        const verificationResponse = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const transactionData = verificationResponse.data.data;
        const expectedAmountInKobo = amount * 100;

        if (transactionData.status === 'success' && transactionData.amount === expectedAmountInKobo) {
            const existingRegistration = await trainingRegistrationModel.findOne({ paymentReference: reference });
            if (existingRegistration) {
                return res.status(200).json({ success: true, message: 'Payment already verified and registration exists.' });
            }

            const newRegistration = new trainingRegistrationModel({
                trainingId,
                fullName,
                email,
                phone,
                paymentReference: reference,
            });
            await newRegistration.save();

            console.log(`✅ Verified and saved registration for training: ${email}`);
            return res.status(200).json({ success: true, message: 'Payment verified and registration complete.' });
        } else {
            return res.status(400).json({ success: false, message: 'Payment verification failed.' });
        }
    } catch (error) {
        console.error("Paystack verification error:", error.response?.data || error.message);
        return res.status(500).json({ success: false, message: 'An internal server error occurred during verification.' });
    }
});

app.post('/api/verify-webinar-payment', async (req, res) => {
    const { reference, email, name, organization, webinarId, amount } = req.body;
    
    if (!reference || !amount) {
        return res.status(400).json({ success: false, message: 'Payment reference or amount is missing.' });
    }

    try {
        const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
        const verificationResponse = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const transactionData = verificationResponse.data.data;
        const expectedAmountInKobo = amount * 100;

        if (transactionData.status === 'success' && transactionData.amount === expectedAmountInKobo) {
            const existingRegistration = await webinarRegistrationModel.findOne({ paymentReference: reference });
            if (existingRegistration) {
                return res.status(200).json({ success: true, message: 'Payment already verified and registration exists.' });
            }

            const newRegistration = new webinarRegistrationModel({
                webinarId,
                name,
                email,
                organization,
                paymentReference: reference,
            });
            await newRegistration.save();

            console.log(`✅ Verified and saved registration for webinar: ${email}`);
            return res.status(200).json({ success: true, message: 'Payment verified and registration complete.' });
        } else {
            return res.status(400).json({ success: false, message: 'Payment verification failed.' });
        }
    } catch (error) {
        console.error("Paystack verification error:", error.response?.data || error.message);
        return res.status(500).json({ success: false, message: 'An internal server error occurred during verification.' });
    }
});

app.post('/api/verify-seminar-payment', async (req, res) => {
    const { reference, email, fullName, phone, seminarId, amount } = req.body;
    
    if (!reference || !amount) {
        return res.status(400).json({ success: false, message: 'Payment reference or amount is missing.' });
    }

    try {
        const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
        const verificationResponse = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const transactionData = verificationResponse.data.data;
        const expectedAmountInKobo = amount * 100;

        if (transactionData.status === 'success' && transactionData.amount === expectedAmountInKobo) {
            const existingRegistration = await seminarRegistrationModel.findOne({ paymentReference: reference });
            if (existingRegistration) {
                return res.status(200).json({ success: true, message: 'Payment already verified and registration exists.' });
            }

            const newRegistration = new seminarRegistrationModel({
                seminarId,
                fullName,
                email,
                phone,
                paymentReference: reference,
            });
            await newRegistration.save();

            console.log(`✅ Verified and saved registration for seminar: ${email}`);
            return res.status(200).json({ success: true, message: 'Payment verified and registration complete.' });
        } else {
            return res.status(400).json({ success: false, message: 'Payment verification failed.' });
        }
    } catch (error) {
        console.error("Paystack verification error:", error.response?.data || error.message);
        return res.status(500).json({ success: false, message: 'An internal server error occurred during verification.' });
    }
});

// API Routes
app.use('/api/news', newsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/nextgen/news', nextgenNewsRoutes);
app.use('/api/press', pressRoutes);
app.use('/api/nextgen/press', nextGenPressRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/nextgen/publications', nextGenPublicationRoutes);
app.use('/api/job-openings', jobOpeningsRoutes);
app.use('/api/nextgen/jobs', nextGenJobRoutes);
app.use('/api/posts', blogRoutes);
app.use('/api/scholarships', scholarshipsRoutes);
app.use('/api/faith', faithRoutes);
app.use('/api/webinars', webinarsRoutes);
app.use('/api/seminars', seminarsRoutes);
app.use('/api/trainings', trainingsRoutes);
app.use('/api/mini-results', miniResultRoutes);
app.use('/api/admin/info', adminInfoRoutes);
app.use('/api/admin/running-analysis', runningAnalysisRoute);
app.use('/api/admin/lead-report', nextGenLeadReportRoute);
app.use('/api/admin/training', nextGenTrainingRoute);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);

// 🚀 CERTIFICATE ROUTES REGISTRATION 🚀
// 1. Issuance/Verification: Maps to POST /api/certificate/issue and GET /api/certificate/verify/:id
app.use('/api/certificate', certificateRoutes); 

// 2. PDF Generation: Maps to POST /api/certificate-generation/generate-pdf
app.use('/api/certificate-generation', certificateGenerationRoutes);
// ------------------------------------------

// Correctly serve the React static files and handle SPA routing
// This must be placed AFTER all API routes
const parentDir = path.resolve(__dirname, '..');
const buildPath = path.join(parentDir, 'client', 'dist');

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve the React build files
app.use(express.static(buildPath));

// Correct catch-all route for Express 5
// This regex-based route avoids the "PathError"
app.get(/^(?!.*(\..*|\/api\/.*)).*$/, (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Start the server only after MongoDB is connected
const startHttpServer = () => app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
