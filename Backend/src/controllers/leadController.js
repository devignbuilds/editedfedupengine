import Lead from '../models/Lead.js';
import Campaign from '../models/Campaign.js';

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private/Admin
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Simulate AI Scraper
// @route   POST /api/leads/scrape
// @access  Private/Admin
export const simulateScrape = async (req, res) => {
  try {
    const mockLeads = [
      { name: 'Alex Rivera', email: `alex.${Date.now()}@techflow.ai`, company: 'TechFlow AI', source: 'LinkedIn' },
      { name: 'Jordan Smith', email: `jordan.${Date.now()}@growthops.com`, company: 'GrowthOps', source: 'Web' },
      { name: 'Casey Montgomery', email: `casey.${Date.now()}@venture.io`, company: 'Venture Inc', source: 'X' }
    ];

    const leads = await Lead.insertMany(mockLeads);
    res.status(201).json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private/Admin
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate('leads');
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create lead manually
// @route   POST /api/leads
// @access  Private/Admin
export const createLead = async (req, res) => {
  const { name, email, company, source } = req.body;
  try {
    const lead = await Lead.create({ name, email, company, source });
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
