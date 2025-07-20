import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  rating: { type: Number, min: 1, max: 5, required: true },
  text: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Review", reviewSchema);
