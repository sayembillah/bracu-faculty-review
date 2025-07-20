import User from "../models/User.js";
import Faculty from "../models/Faculty.js";
import Review from "../models/Review.js";
import Visitor from "../models/Visitor.js";

// GET /api/admin/metrics
export const getMetrics = async (req, res) => {
  try {
    const [userCount, facultyCount, reviewCount, visitorCount] =
      await Promise.all([
        User.countDocuments(),
        Faculty.countDocuments(),
        Review.countDocuments(),
        Visitor.countDocuments(),
      ]);

    res.json({
      userCount,
      facultyCount,
      reviewCount,
      visitorCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch metrics" });
  }
};
