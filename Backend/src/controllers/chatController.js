import Message from '../models/Message.js';

// @desc    Get messages for a project
// @route   GET /api/chat/project/:projectId
// @access  Private
const getMessagesByProject = async (req, res) => {
  const messages = await Message.find({ project: req.params.projectId })
    .populate('sender', 'name email')
    .sort({ createdAt: 1 }); // Oldest first
  res.json(messages);
};

export { getMessagesByProject };
