import mongoose from 'mongoose';

const nextGenTrainingSchema = new mongoose.Schema({
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

const NextGenTraining = mongoose.model('NextGenTraining', nextGenTrainingSchema);

export default NextGenTraining;