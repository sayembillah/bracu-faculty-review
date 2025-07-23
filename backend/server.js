import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";

dotenv.config();

const app = express();

//Middleware to handle cors
// Allow both localhost:7000 and localhost:7001 for dev
app.use(
  cors({
    origin: ["http://localhost:7000", "http://localhost:7001"],
    credentials: true,
  })
);

//Middleware to parse json
app.use(express.json());

// Connect database
connectDB();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api", reviewRoutes);
app.use("/api", facultyRoutes);
app.use("/api", notificationRoutes);
app.use("/api", activityRoutes);
app.use("/api", adminRoutes);
app.use("/api", visitorRoutes);

//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
