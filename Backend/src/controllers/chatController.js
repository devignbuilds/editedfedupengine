import Message from "../models/Message.js";

// @desc    Get messages for a project
// @route   GET /api/chat/project/:projectId
// @access  Private
const getMessagesByProject = async (req, res) => {
  const messages = await Message.find({ project: req.params.projectId })
    .populate("sender", "name email")
    .sort({ createdAt: 1 }); // Oldest first
  res.json(messages);
};

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
  const { projectId, content } = req.body;
  const isGeneral = projectId === "general";

  try {
    const message = await Message.create({
      project: isGeneral ? undefined : projectId,
      isGeneral,
      sender: req.user._id,
      content,
    });

    const populatedMessage = await message.populate(
      "sender",
      "name email role",
    );
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: "Error sending message" });
  }
};

// @desc    Get general chat messages
// @route   GET /api/chat/general
// @access  Private
const getGeneralMessages = async (req, res) => {
  const messages = await Message.find({ isGeneral: true })
    .populate("sender", "name email role")
    .sort({ createdAt: 1 });
  res.json(messages);
};

export { getMessagesByProject, getGeneralMessages, sendMessage };
