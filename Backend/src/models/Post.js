import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  platforms: [{
    type: String,
    enum: ['X', 'LinkedIn', 'Web'],
    required: true,
  }],
  status: {
    type: String,
    enum: ['Draft', 'Scheduled', 'Published', 'Failed'],
    default: 'Draft',
  },
  scheduledAt: {
    type: Date,
  },
  aiGenerated: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('Post', postSchema);
export default Post;
