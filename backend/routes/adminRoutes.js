import express from "express";
import { getMetrics } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin can access metrics
router.get(
  "/admin/metrics",
  authMiddleware,
  (req, res, next) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  },
  getMetrics
);

export default router;
