import express from "express";
import { createReview } from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/user/reviews - Create a new review (protected)
router.post("/user/reviews", authMiddleware, createReview);

export default router;
