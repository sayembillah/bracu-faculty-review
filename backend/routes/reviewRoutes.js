import express from "express";
import {
  createReview,
  getMyReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/user/reviews - Create a new review (protected)
router.post("/user/reviews", authMiddleware, createReview);

/**
 * @route   GET /api/user/reviews/my
 * @desc    Get all reviews by the authenticated user
 * @access  Private
 */
router.get("/user/reviews/my", authMiddleware, getMyReviews);

/**
 * @route   PUT /api/user/reviews/:id
 * @desc    Update a review by the user
 * @access  Private
 */
router.put("/user/reviews/:id", authMiddleware, updateReview);

/**
 * @route   DELETE /api/user/reviews/:id
 * @desc    Delete a review by the user
 * @access  Private
 */
router.delete("/user/reviews/:id", authMiddleware, deleteReview);

export default router;
