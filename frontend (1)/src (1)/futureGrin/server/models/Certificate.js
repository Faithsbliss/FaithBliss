// src/models/Certificate.js 
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Ensure 'uuid' package is installed

const certificateSchema = new mongoose.Schema({
  // Data for the certificate design
  studentName: { type: String, required: true },
  awardTitle: { type: String }, // 👈 MODIFIED: Removed required: true
  courseDetails: { type: String, required: true },
  // UPDATED DEFAULT: Set to empty string
  directorSignature: { type: String, default: '' }, 
  
  // Unique Verifier
  certificateId: { 
    type: String, 
    unique: true, 
    required: true, 
    default: () => uuidv4().substring(0, 8).toUpperCase() // Auto-generate 8-char ID
  }, 
  issueDate: { type: Date, default: Date.now },
  
  // Link for third-party verification
  verificationUrl: { type: String, required: true, unique: true },
});

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;