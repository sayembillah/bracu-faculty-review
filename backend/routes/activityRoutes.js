import express from "express";
import { getRecentActivities } from "../controllers/activityController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin can access activities
router.get(
  "/admin/activities",
  authMiddleware,
  (req, res, next) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  },
  getRecentActivities
);

export default router;
