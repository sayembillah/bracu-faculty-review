import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  initial: { type: String, unique: true },
  department: String,
  courses: { type: [String], default: [] },

  // Computed fields
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
});

export default mongoose.model("Faculty", facultySchema);
