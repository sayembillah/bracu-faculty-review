import express from "express";
import {
  getMyNotifications,
  deleteNotification,
} from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/user/notifications/my
 * @desc    Get all notifications for the authenticated user
 * @access  Private
 */
router.get("/user/notifications/my", authMiddleware, getMyNotifications);

/**
 * @route   DELETE /api/user/notifications/:id
 * @desc    Delete a notification by ID
 * @access  Private
 */
router.delete("/user/notifications/:id", authMiddleware, deleteNotification);

export default router;
