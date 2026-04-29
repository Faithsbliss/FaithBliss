import mongoose from 'mongoose';

const runningAnalysisSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  miniReportFileUrl: {
    type: String,
    required: false, // Not required, as it might be text-only
  },
  fullReportFileUrl: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RunningAnalysis = mongoose.model('RunningAnalysis', runningAnalysisSchema);

export default RunningAnalysis;