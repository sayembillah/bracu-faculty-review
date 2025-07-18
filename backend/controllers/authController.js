import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register the user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, adminInvitationToken } = req.body;

    // Checking if the user already exist
    const userExists = await User.findOne({ email });
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
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
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
