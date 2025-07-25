import Notification from "../models/Notification.js";

// Get all notifications for the authenticated user
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Delete a notification by ID
 * DELETE /api/notifications/:id
 */
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationId = req.params.id;
    const deleted = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
