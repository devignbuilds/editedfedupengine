import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: String,
    enum: ['Free', 'Agency', 'Enterprise'],
    default: 'Free',
  },
  status: {
    type: String,
    enum: ['active', 'past_due', 'canceled'],
    default: 'active',
  },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  currentPeriodEnd: Date,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Billing = mongoose.model('Billing', billingSchema);
export default Billing;
