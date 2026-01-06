import Organization from '../models/Organization.js';
import Billing from '../models/Billing.js';

// --- Org Controllers ---
export const getOrgDetails = async (req, res) => {
  try {
    let org = await Organization.findOne({ owner: req.user._id });
    if (!org) {
      org = await Organization.create({
        name: `${req.user.name}'s Agency`,
        owner: req.user._id,
        slug: req.user.name.split(' ')[0].toLowerCase() + '-' + Math.random().toString(36).substring(7)
      });
    }
    res.json(org);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrgBranding = async (req, res) => {
  try {
    const org = await Organization.findOneAndUpdate(
      { owner: req.user._id },
      { branding: req.body.branding, settings: req.body.settings },
      { new: true }
    );
    res.json(org);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Billing Controllers ---
export const getBillingStatus = async (req, res) => {
  try {
    let billing = await Billing.findOne({ user: req.user._id });
    if (!billing) {
      billing = await Billing.create({ user: req.user._id });
    }
    res.json(billing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const billing = await Billing.findOneAndUpdate(
      { user: req.user._id },
      { plan: req.body.plan, status: 'active' },
      { new: true }
    );
    res.json(billing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
