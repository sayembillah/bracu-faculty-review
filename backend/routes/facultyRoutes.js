import express from "express";
import {
  getAllFaculties,
  addFaculty,
  updateFaculty,
  deleteFaculty,
} from "../controllers/facultyController.js";
import { getReviewsByFaculty } from "../controllers/reviewController.js";
import authMiddleware, { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/faculties
 * @desc    Add a new faculty (admin only)
 * @access  Private/Admin
 */
router.post("/faculties", authMiddleware, isAdmin, addFaculty);

/**
 * @route   PUT /api/faculties/:id
 * @desc    Update a faculty (admin only)
 * @access  Private/Admin
 */
router.put("/faculties/:id", authMiddleware, isAdmin, updateFaculty);

/**
 * @route   DELETE /api/faculties/:id
 * @desc    Delete a faculty (admin only)
 * @access  Private/Admin
 */
router.delete("/faculties/:id", authMiddleware, isAdmin, deleteFaculty);

// GET /api/faculties - Get all faculties
router.get("/faculties", getAllFaculties);

/**
 * @route   GET /api/faculties/:id/reviews
 * @desc    Get all reviews for a specific faculty (public)
 */
router.get("/faculties/:id/reviews", getReviewsByFaculty);

export default router;
