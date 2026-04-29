import mongoose from 'mongoose';

const nextGenPublicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String, // Storing as a string for simplicity, you can use Date for more flexibility
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  link: {
    type: String, // Link to the PDF or external page
    required: false,
  },
}, { timestamps: true });

const NextGenPublication = mongoose.model('NextGenPublication', nextGenPublicationSchema);
export default NextGenPublication;