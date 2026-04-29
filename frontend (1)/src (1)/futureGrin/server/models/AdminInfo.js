import mongoose from 'mongoose';

const adminInfoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: { // This will now primarily be for the "mini report" content if not a file
    type: String,
    required: false, // Make description optional if it will be replaced by a file
  },
  icon: {
    type: String,
    required: false, // Icon might not be relevant for all admin info types
  },
  miniReportFileUrl: { // URL for the mini report file (e.g., PDF, TXT)
    type: String,
    required: false,
  },
  fullReportFileUrl: { // URL for the full report file (e.g., PDF, DOCX)
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AdminInfo = mongoose.model('AdminInfo', adminInfoSchema);

export default AdminInfo;