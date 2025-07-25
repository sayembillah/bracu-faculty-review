import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logActivity } from "./activityController.js";

//Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register the user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, adminInvitationToken } = req.body;
    const emailLower = email.toLowerCase();

    // Checking if the user already exist
    const userExists = await User.findOne({ email: emailLower });
    if (userExists) {
      return res.status(400).json({ message: "User already exist" });
    }

    // Determine user role
    let role = "user";
    if (
      adminInvitationToken &&
      adminInvitationToken == process.env.ADMIN_INVITATION_TOKEN
    ) {
      role = "admin";
    } else if (
      adminInvitationToken &&
      adminInvitationToken != process.env.ADMIN_INVITATION_TOKEN
    )
      return res
        .status(498)
        .json({ message: "Invalid admin invitation token" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email: emailLower,
      password: hashedPassword,
      role,
    });

    // Log registration activity
    await logActivity({
      type: "other",
      user: user._id,
      description: `Registered as ${role}`,
    });

    // Returning user data with JWT token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Login the user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // extract credential from request
    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email: emailLower }); // find user by email from database

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    } // if user not found return 401

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    } // if password not match return 401

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

    // Log login activity
    await logActivity({
      type: "login",
      user: user._id,
      description: "User logged in",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Add a faculty to user's favorites
 * POST /api/auth/favorites/:facultyId
 */
export const addFavoriteFaculty = async (req, res) => {
  try {
    const userId = req.user._id;
    const { facultyId } = req.params;
    if (!facultyId) {
      return res.status(400).json({ message: "Faculty ID is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.favorites.includes(facultyId)) {
      return res.status(400).json({ message: "Faculty already in favorites" });
    }
    user.favorites.push(facultyId);
    await user.save();
    res.json({ message: "Faculty added to favorites" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Remove a faculty from user's favorites
 * DELETE /api/auth/favorites/:facultyId
 */
export const removeFavoriteFaculty = async (req, res) => {
  try {
    const userId = req.user._id;
    const { facultyId } = req.params;
    if (!facultyId) {
      return res.status(400).json({ message: "Faculty ID is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.favorites = user.favorites.filter((id) => id.toString() !== facultyId);
    await user.save();
    res.json({ message: "Faculty removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Get user's favorite faculties (populated)
 * GET /api/auth/favorites
 */
export const getFavoriteFaculties = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get current user profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "_id name email role"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
