import express from "express";
import { getMyNotifications } from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/user/notifications/my
 * @desc    Get all notifications for the authenticated user
 * @access  Private
 */
router.get("/user/notifications/my", authMiddleware, getMyNotifications);

export default router;
