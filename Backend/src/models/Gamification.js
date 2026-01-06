import mongoose from 'mongoose';

const gamificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  points: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badges: [{
    name: { type: String },
    icon: { type: String },
    awardedAt: { type: Date, default: Date.now }
  }],
  activityLog: [{
    action: { type: String },
    pointsGained: { type: Number },
    date: { type: Date, default: Date.now }
  }],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Gamification = mongoose.model('Gamification', gamificationSchema);
export default Gamification;
