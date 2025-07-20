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
