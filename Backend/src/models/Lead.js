import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  company: {
    type: String,
  },
  source: {
    type: String,
    enum: ['LinkedIn', 'X', 'Web', 'Manual'],
    default: 'Web',
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Nurture', 'Converted', 'Rejected'],
    default: 'New',
  },
  lastAIAction: {
    type: String,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
