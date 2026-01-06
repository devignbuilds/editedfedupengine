import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'pending'],
    default: 'active',
  },
  deadline: {
    type: Date,
  },
  budget: {
    type: String,
    default: '',
  },
  serviceType: {
    type: String,
    enum: ['development', 'design', 'both'],
    default: 'both',
  },
  paymentModel: {
    type: String,
    enum: ['one-time', 'subscription', 'quote'],
    default: 'quote',
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  tags: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
