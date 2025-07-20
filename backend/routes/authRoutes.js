import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  addFavoriteFaculty,
  removeFavoriteFaculty,
  getFavoriteFaculties,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth Routes
router.post("/register", registerUser); //Register a new user or admin
router.post("/login", loginUser); //Login user or admin

// Get current user profile
router.get("/me", authMiddleware, getMe);

// Favorite faculties routes
router.post("/favorites/:facultyId", authMiddleware, addFavoriteFaculty);
router.delete("/favorites/:facultyId", authMiddleware, removeFavoriteFaculty);
router.get("/favorites", authMiddleware, getFavoriteFaculties);

export default router;
