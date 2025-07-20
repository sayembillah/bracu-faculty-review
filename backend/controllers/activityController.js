import Activity from "../models/Activity.js";
import User from "../models/User.js";

// Utility: Log an activity (to be called from other controllers)
export const logActivity = async ({
  type,
  user,
  description,
  relatedEntity = null,
  entityModel = null,
}) => {
  try {
    await Activity.create({
      type,
      user,
      description,
      relatedEntity,
      entityModel,
    });
  } catch (err) {
    // Optionally log error, but don't throw to avoid breaking main flow
    console.error("Activity log error:", err.message);
  }
};

// GET /api/admin/activities?limit=20
export const getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const activities = await Activity.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user", "name email role")
      .populate("relatedEntity")
      .lean();

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};
