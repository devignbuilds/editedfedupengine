import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Paused', 'Completed'],
    default: 'Draft',
  },
  leads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  }],
  currentStep: {
    type: Number,
    default: 0
  },
  totalSteps: {
    type: Number,
    required: true
  },
  metrics: {
    emailsSent: { type: Number, default: 0 },
    responses: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;
