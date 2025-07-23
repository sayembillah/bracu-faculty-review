import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Faculty" }],
  },
  { timestamps: true }
);

// Ensure email is always stored in lowercase
UserSchema.pre("save", function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// const User = mongoose.model("User", UserSchema);
export default mongoose.model("User", UserSchema);
