import express from "express";
import {
  getMetrics,
  getAllUsers,
  getUserReviews,
  deleteReviewById,
} from "../controllers/adminController.js";
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

/**
 * List/search users (admin only)
 * GET /api/admin/users?search=
 */
router.get(
  "/admin/users",
  authMiddleware,
  (req, res, next) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  },
  getAllUsers
);

/**
 * Get all reviews by a user (admin only)
 * GET /api/admin/users/:userId/reviews
 */
router.get(
  "/admin/users/:userId/reviews",
  authMiddleware,
  (req, res, next) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  },
  getUserReviews
);

/**
 * Delete a review by ID (admin only)
 * DELETE /api/admin/reviews/:reviewId
 */
router.delete(
  "/admin/reviews/:reviewId",
  authMiddleware,
  (req, res, next) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  },
  deleteReviewById
);

/**
 * Permanently delete a user (admin only)
 * DELETE /api/admin/users/:userId
 */
import { deleteUserById } from "../controllers/adminController.js";
router.delete(
  "/admin/users/:userId",
  authMiddleware,
  (req, res, next) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  },
  deleteUserById
);

/**
 * Get all flagged reviews (admin only)
 * GET /api/admin/flagged-reviews
 */
import { getFlaggedReviews } from "../controllers/adminController.js";
router.get(
  "/admin/flagged-reviews",
  authMiddleware,
  (req, res, next) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  },
  getFlaggedReviews
);

export default router;
