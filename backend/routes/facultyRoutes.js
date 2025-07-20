import express from "express";
import { getAllFaculties } from "../controllers/facultyController.js";
import { getReviewsByFaculty } from "../controllers/reviewController.js";

const router = express.Router();

// GET /api/faculties - Get all faculties
router.get("/faculties", getAllFaculties);

/**
 * @route   GET /api/faculties/:id/reviews
 * @desc    Get all reviews for a specific faculty (public)
 */
router.get("/faculties/:id/reviews", getReviewsByFaculty);

export default router;
