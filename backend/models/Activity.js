import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "login",
        "logout",
        "review",
        "like",
        "faculty_change",
        "flag",
        "other",
      ],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    relatedEntity: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "entityModel",
    },
    entityModel: {
      type: String,
      enum: ["Faculty", "Review", "User", "Notification"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
