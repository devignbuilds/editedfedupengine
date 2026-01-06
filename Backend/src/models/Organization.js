import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  branding: {
    logo: String,
    primaryColor: { type: String, default: '#000000' },
    font: { type: String, default: 'Inter' }
  },
  settings: {
    customDomain: String,
    whiteLabeled: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Organization = mongoose.model('Organization', organizationSchema);
export default Organization;
