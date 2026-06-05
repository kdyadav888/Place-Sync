import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate('relatedUser', 'name avatar')
      .populate('relatedJob', 'title company')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id, isRead: false })
      .populate('relatedUser', 'name avatar')
      .sort({ createdAt: -1 });
    
    const count = notifications.length;
    
    res.status(200).json({ success: true, notifications, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    await Notification.findByIdAndUpdate(notificationId, {
      isRead: true,
      readAt: new Date(),
    });
    
    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    await Notification.findByIdAndDelete(notificationId);
    
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

