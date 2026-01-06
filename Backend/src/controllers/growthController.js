import Affiliate from '../models/Affiliate.js';
import Gamification from '../models/Gamification.js';
import User from '../models/User.js';

// @desc    Get affiliate details for current user
// @route   GET /api/growth/affiliate
// @access  Private
export const getAffiliateStats = async (req, res) => {
  try {
    let affiliate = await Affiliate.findOne({ user: req.user._id }).populate('referrals.user', 'name email');
    
    if (!affiliate) {
      // Create affiliate profile if it doesn't exist
      const referralCode = `DEVIGN-${req.user.name.split(' ')[0].toUpperCase()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
      affiliate = await Affiliate.create({
        user: req.user._id,
        referralCode
      });
    }
    
    res.json(affiliate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get gamification stats for current user
// @route   GET /api/growth/gamification
// @access  Private
export const getGamificationStats = async (req, res) => {
  try {
    let stats = await Gamification.findOne({ user: req.user._id });
    
    if (!stats) {
      stats = await Gamification.create({ user: req.user._id });
    }
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Simulate earning points (Gamification trigger)
// @route   POST /api/growth/gamification/action
// @access  Private
export const triggerAction = async (req, res) => {
  const { action, points } = req.body;
  try {
    let stats = await Gamification.findOne({ user: req.user._id });
    if (!stats) stats = await Gamification.create({ user: req.user._id });

    stats.points += points;
    stats.activityLog.push({ action, pointsGained: points });
    
    // Simple level up logic
    stats.level = Math.floor(stats.points / 100) + 1;
    
    await stats.save();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
