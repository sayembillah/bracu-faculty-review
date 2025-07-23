import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  rating: { type: Number, min: 1, max: 5, required: true },
  text: { type: String, default: "" },
  isAdmin: { type: Boolean, default: false }, // true for admin/public reviews
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  flags: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Review", reviewSchema);
