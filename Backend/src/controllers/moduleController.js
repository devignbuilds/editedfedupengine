import ModuleConfig from '../models/ModuleConfig.js';

// @desc    Get user's module configuration
// @route   GET /api/modules/config
// @access  Private
export const getModuleConfig = async (req, res) => {
  try {
    let config = await ModuleConfig.findOne({ user: req.user._id });
    
    // Create default config if none exists (MVP modules only)
    if (!config) {
      config = await ModuleConfig.create({
        user: req.user._id,
        enabledModules: ['BILLING'], // Only billing enabled by default
      });
    }
    
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update module configuration
// @route   PUT /api/modules/config
// @access  Private (Admin only)
export const updateModuleConfig = async (req, res) => {
  const { enabledModules } = req.body;
  
  try {
    let config = await ModuleConfig.findOne({ user: req.user._id });
    
    if (!config) {
      config = await ModuleConfig.create({
        user: req.user._id,
        enabledModules,
      });
    } else {
      config.enabledModules = enabledModules;
      config.updatedAt = Date.now();
      await config.save();
    }
    
    res.json(config);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
