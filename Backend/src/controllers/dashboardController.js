import Project from '../models/Project.js';
import User from '../models/User.js';
import Invoice from '../models/Invoice.js';
import Task from '../models/Task.js';
import ModuleConfig from '../models/ModuleConfig.js';

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const projectsCount = await Project.countDocuments();
    const usersCount = await User.countDocuments();
    
    const paidInvoices = await Invoice.find({ status: 'paid' });
    const totalRevenue = paidInvoices.reduce((acc, inv) => acc + inv.amount, 0);

    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('client', 'name email');

    // For MVP, active modules are the count of unique module types available
    const activeModulesCount = [
      'AI_GROWTH', 'CONTENT_HUB', 'SCALE_ENGINE', 'WHITE_LABEL', 'BILLING', 'GAMIFICATION', 'AFFILIATE'
    ].length;

    res.json({
      projects: projectsCount,
      users: usersCount,
      revenue: totalRevenue,
      activeModules: activeModulesCount,
      visits: 8902, // Mock for now, requires analytics integration
      recentProjects
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getAdminStats };
