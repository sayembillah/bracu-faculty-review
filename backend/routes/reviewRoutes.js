import express from "express";
import {
  createReview,
  getMyReviews,
  updateReview,
  deleteReview,
  likeReview,
  dislikeReview,
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

/**
 * @route   POST /api/reviews/:id/like
 * @desc    Like a review (user can only like or dislike, not both)
 * @access  Private
 */
router.post("/reviews/:id/like", authMiddleware, likeReview);

/**
 * @route   POST /api/reviews/:id/dislike
 * @desc    Dislike a review (user can only like or dislike, not both)
 * @access  Private
 */
router.post("/reviews/:id/dislike", authMiddleware, dislikeReview);

export default router;
