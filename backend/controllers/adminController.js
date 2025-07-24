import User from "../models/User.js";
import Faculty from "../models/Faculty.js";
import Review from "../models/Review.js";
import Visitor from "../models/Visitor.js";
import mongoose from "mongoose";

// GET /api/admin/metrics
export const getMetrics = async (req, res) => {
  try {
    const [userCount, facultyCount, reviewCount, visitorCount] =
      await Promise.all([
        User.countDocuments(),
        Faculty.countDocuments(),
        Review.countDocuments(),
        Visitor.countDocuments(),
      ]);

    res.json({
      userCount,
      facultyCount,
      reviewCount,
      visitorCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch metrics" });
  }
};

/**
 * Get all flagged reviews (admin only)
 * GET /api/admin/flagged-reviews
 */
export const getFlaggedReviews = async (req, res) => {
  try {
    const flagged = await Review.find({ "flags.0": { $exists: true } })
      .populate("user", "name email")
      .populate("faculty", "initial department")
      .lean();
    res.json(flagged);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch flagged reviews", error: err.message });
  }
};

/**
 * List/search users (admin only)
 * GET /api/admin/users?search=
 */
export const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const users = await User.find(query)
      .select("_id name email createdAt lastLogin")
      .lean();

    // For each user, count number of reviews
    const userIds = users.map((u) => u._id);
    const reviewCounts = await Review.aggregate([
      {
        $match: {
          user: { $in: userIds.map((id) => new mongoose.Types.ObjectId(id)) },
        },
      },
      { $group: { _id: "$user", count: { $sum: 1 } } },
    ]);
    const reviewCountMap = {};
    reviewCounts.forEach((rc) => {
      reviewCountMap[rc._id.toString()] = rc.count;
    });

    const usersWithReviewCount = users.map((u) => ({
      ...u,
      reviewCount: reviewCountMap[u._id.toString()] || 0,
    }));

    res.json(usersWithReviewCount);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};

/**
 * Get all reviews by a user (admin only)
 * GET /api/admin/users/:userId/reviews
 */
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ user: userId })
      .populate("faculty")
      .sort({ createdAt: -1 })
      .lean();
    res.json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user reviews", error: err.message });
  }
};

/**
 * Delete a review by ID (admin only)
 * DELETE /api/admin/reviews/:reviewId
 */
export const deleteReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete review", error: err.message });
  }
};

/**
 * Permanently delete a user (admin only)
 * DELETE /api/admin/users/:userId
 */
export const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    // Optionally, delete all reviews by this user
    await Review.deleteMany({ user: userId });
    res.json({ message: "User deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: err.message });
  }
};
