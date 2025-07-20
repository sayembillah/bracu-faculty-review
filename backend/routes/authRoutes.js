import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth Routes
router.post("/register", registerUser); //Register a new user or admin
router.post("/login", loginUser); //Login user or admin

// Get current user profile
router.get("/me", authMiddleware, getMe);

export default router;
