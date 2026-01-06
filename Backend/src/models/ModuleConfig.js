import mongoose from 'mongoose';

const moduleConfigSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  enabledModules: [{
    type: String,
    enum: [
      'AI_GROWTH',
      'CONTENT_HUB',
      'SCALE_ENGINE',
      'WHITE_LABEL',
      'BILLING',
      'GAMIFICATION',
      'AFFILIATE'
    ],
  }],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ModuleConfig = mongoose.model('ModuleConfig', moduleConfigSchema);
export default ModuleConfig;
