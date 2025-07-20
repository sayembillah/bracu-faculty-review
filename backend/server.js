import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();

//Middleware to handle cors
app.use(cors());

//Middleware to parse json
app.use(express.json());

// Connect database
connectDB();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api", reviewRoutes);
app.use("/api", facultyRoutes);
app.use("/api", notificationRoutes);

//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
