import Notification from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 });
  res.json(notifications);
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    if (notification.recipient.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    notification.read = true;
    await notification.save();
    res.json(notification);
  } else {
    res.status(404).json({ message: 'Notification not found' });
  }
};

// @desc    Create notification (Internal use)
const createNotification = async (recipientId, message, type = 'info', link = null) => {
  try {
    await Notification.create({
      recipient: recipientId,
      message,
      type,
      link,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

export { getNotifications, markAsRead, createNotification };
