import Faculty from "../models/Faculty.js";
import Review from "../models/Review.js";

/**
 * POST /api/faculties - Add a new faculty (admin only)
 * Accepts optional adminReviews: [{ rating, text }]
 */
export const addFaculty = async (req, res) => {
  try {
    const { initial, name, department, taughtCourses, adminReviews } = req.body;

    // Validate required fields
    if (!initial || !name || !department || !Array.isArray(taughtCourses)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicate initial
    const existing = await Faculty.findOne({ initial });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Faculty initial already exists" });
    }

    // Create new faculty
    const faculty = await Faculty.create({
      initial,
      name,
      department,
      courses: taughtCourses,
      averageRating: 0,
      totalReviews: 0,
    });

    // Handle admin reviews if provided
    if (Array.isArray(adminReviews) && adminReviews.length > 0) {
      for (const review of adminReviews) {
        if (review.rating && review.text !== undefined) {
          const createdReview = await Review.create({
            faculty: faculty._id,
            rating: review.rating,
            text: review.text,
            isAdmin: true,
          });
          console.log("Admin review created:", createdReview);
        }
      }
      // Update faculty stats
      const reviews = await Review.find({ faculty: faculty._id });
      const totalReviews = reviews.length;
      const averageRating =
        totalReviews > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;
      faculty.averageRating = averageRating;
      faculty.totalReviews = totalReviews;
      await faculty.save();
    }

    res.status(201).json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * PUT /api/faculties/:id - Update faculty (admin only)
 * Accepts optional adminReviews: [{ _id?, rating, text, _delete? }]
 */
export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { initial, name, department, taughtCourses, adminReviews } = req.body;

    // Validate required fields
    if (!initial || !name || !department || !Array.isArray(taughtCourses)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicate initial (if changed)
    const existing = await Faculty.findOne({ initial, _id: { $ne: id } });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Faculty initial already exists" });
    }

    const faculty = await Faculty.findByIdAndUpdate(
      id,
      {
        initial,
        name,
        department,
        courses: taughtCourses,
      },
      { new: true }
    );

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Handle admin reviews if provided
    if (Array.isArray(adminReviews)) {
      // Fetch all current admin reviews for this faculty
      const currentAdminReviews = await Review.find({
        faculty: faculty._id,
        isAdmin: true,
      });

      // Track which reviews to keep, update, add, or delete
      const toUpdate = [];
      const toAdd = [];
      const toDeleteIds = [];

      // Mark all current admin review IDs
      const currentIds = currentAdminReviews.map((r) => r._id.toString());

      // Process incoming adminReviews
      for (const review of adminReviews) {
        if (review._delete && review._id) {
          toDeleteIds.push(review._id);
        } else if (review._id) {
          // Update existing
          toUpdate.push(review);
        } else if (review.rating && review.text !== undefined) {
          // Add new
          toAdd.push(review);
        }
      }

      // Delete marked reviews
      if (toDeleteIds.length > 0) {
        await Review.deleteMany({
          _id: { $in: toDeleteIds },
          faculty: faculty._id,
          isAdmin: true,
        });
      }

      // Update existing reviews
      for (const review of toUpdate) {
        await Review.findOneAndUpdate(
          { _id: review._id, faculty: faculty._id, isAdmin: true },
          { rating: review.rating, text: review.text }
        );
      }

      // Add new reviews
      for (const review of toAdd) {
        await Review.create({
          faculty: faculty._id,
          rating: review.rating,
          text: review.text,
          isAdmin: true,
        });
      }

      // Update faculty stats
      const reviews = await Review.find({ faculty: faculty._id });
      const totalReviews = reviews.length;
      const averageRating =
        totalReviews > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;
      faculty.averageRating = averageRating;
      faculty.totalReviews = totalReviews;
      await faculty.save();
    }

    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * DELETE /api/faculties/:id - Delete faculty (admin only)
 */
export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findByIdAndDelete(id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.json({ message: "Faculty deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET /api/faculties - Get all faculties
export const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find({});
    res.status(200).json(faculties);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
