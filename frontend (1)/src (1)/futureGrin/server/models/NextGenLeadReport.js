import mongoose from 'mongoose';

const nextGenLeadReportSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NextGenLeadReport = mongoose.model('NextGenLeadReport', nextGenLeadReportSchema);

export default NextGenLeadReport;