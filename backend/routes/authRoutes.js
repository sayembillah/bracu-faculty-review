import express from "express";
import { registerUser } from "../controllers/authController.js";

const router = express.Router();

// Auth Routes
router.post("/register", registerUser); //Register a new user or admin

export default router;
