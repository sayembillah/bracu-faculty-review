import Review from "../models/Review.js";
import Faculty from "../models/Faculty.js";
import Notification from "../models/Notification.js";
import { logActivity } from "./activityController.js";

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { faculty, rating, text } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!faculty || !rating) {
      return res
        .status(400)
        .json({ message: "Faculty and rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if faculty exists
    const facultyDoc = await Faculty.findById(faculty);
    if (!facultyDoc) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      faculty,
      rating,
      text: text || "",
    });

    // Update faculty's averageRating and totalReviews
    const reviews = await Review.find({ faculty });
    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    facultyDoc.averageRating = averageRating;
    facultyDoc.totalReviews = totalReviews;
    await facultyDoc.save();

    // Optionally populate user and faculty info
    const populatedReview = await Review.findById(review._id)
      .populate("user", "name email")
      .populate("faculty", "name initial department");

    res.status(201).json(populatedReview);

    // Log review creation activity
    await logActivity({
      type: "review",
      user: userId,
      description: `Reviewed faculty: ${facultyDoc.name}`,
      relatedEntity: facultyDoc._id,
      entityModel: "Faculty",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all reviews by the authenticated user
export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviews = await Review.find({ user: userId })
      .populate("faculty", "name initial department")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update a review by the user
export const updateReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviewId = req.params.id;
    const { rating, text } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (rating !== undefined) review.rating = rating;
    if (text !== undefined) review.text = text;

    await review.save();

    // Update faculty's averageRating and totalReviews
    const facultyDoc = await Faculty.findById(review.faculty);
    const reviews = await Review.find({ faculty: review.faculty });
    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    facultyDoc.averageRating = averageRating;
    facultyDoc.totalReviews = totalReviews;
    await facultyDoc.save();

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name email")
      .populate("faculty", "name initial department");

    res.json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Get all reviews for a specific faculty (public)
 */
export const getReviewsByFaculty = async (req, res) => {
  try {
    const facultyId = req.params.id;
    // Check if faculty exists
    const facultyDoc = await Faculty.findById(facultyId);
    if (!facultyDoc) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    // Find and populate reviews
    const reviews = await Review.find({ faculty: facultyId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Like a review (user can only like or dislike, not both)
 */
export const likeReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    // Remove user from dislikes if present
    review.dislikes = review.dislikes.filter(
      (id) => id.toString() !== userId.toString()
    );
    // Toggle like
    if (review.likes.some((id) => id.toString() === userId.toString())) {
      // Already liked, remove like
      review.likes = review.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Add like
      review.likes.push(userId);
    }
    await review.save();
    const populated = await Review.findById(reviewId).populate(
      "user",
      "name email"
    );
    res.json(populated);

    // Log like activity
    await logActivity({
      type: "like",
      user: userId,
      description: `Liked review: ${reviewId}`,
      relatedEntity: reviewId,
      entityModel: "Review",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Dislike a review (user can only like or dislike, not both)
 */
export const dislikeReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    // Remove user from likes if present
    review.likes = review.likes.filter(
      (id) => id.toString() !== userId.toString()
    );
    // Toggle dislike
    if (review.dislikes.some((id) => id.toString() === userId.toString())) {
      // Already disliked, remove dislike
      review.dislikes = review.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Add dislike
      review.dislikes.push(userId);
    }
    await review.save();
    const populated = await Review.findById(reviewId).populate(
      "user",
      "name email"
    );
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Flag a review (report)
 * POST /api/reviews/:id/flag
 */
export const flagReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId).populate("user", "name");
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Prevent duplicate flag by same user
    if (review.flags.some((f) => f.user.toString() === userId.toString())) {
      return res
        .status(400)
        .json({ message: "You have already flagged this review." });
    }

    review.flags.push({ user: userId });
    await review.save();

    // Create admin notification for each admin user
    const admins = await (
      await import("../models/User.js")
    ).default.find({ role: "admin" });
    console.log(
      "FlagReview: Found admin users:",
      admins.map((a) => ({ _id: a._id, name: a.name, email: a.email }))
    );
    for (const admin of admins) {
      const notif = await Notification.create({
        type: "flag",
        message: `${req.user.name} has flagged a review. Please review it.`,
        review: reviewId,
        user: admin._id,
        createdAt: new Date(),
        isRead: false,
      });
      console.log(
        "FlagReview: Created notification for admin",
        admin._id,
        notif._id
      );
    }

    res.json({ message: "Review flagged successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a review by the user
export const deleteReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const facultyId = review.faculty;
    await review.deleteOne();

    // Update faculty's averageRating and totalReviews
    const facultyDoc = await Faculty.findById(facultyId);
    const reviews = await Review.find({ faculty: facultyId });
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    facultyDoc.averageRating = averageRating;
    facultyDoc.totalReviews = totalReviews;
    await facultyDoc.save();

    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
