import Review from "../models/Review.js";
import Faculty from "../models/Faculty.js";

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { faculty, rating, text } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!faculty || !rating) {
      return res
        .status(400)
        .json({ message: "Faculty and rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if faculty exists
    const facultyDoc = await Faculty.findById(faculty);
    if (!facultyDoc) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      faculty,
      rating,
      text: text || "",
    });

    // Update faculty's averageRating and totalReviews
    const reviews = await Review.find({ faculty });
    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    facultyDoc.averageRating = averageRating;
    facultyDoc.totalReviews = totalReviews;
    await facultyDoc.save();

    // Optionally populate user and faculty info
    const populatedReview = await Review.findById(review._id)
      .populate("user", "name email")
      .populate("faculty", "name initial department");

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
