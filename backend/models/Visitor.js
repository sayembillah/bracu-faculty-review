import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  visitorId: { type: String, unique: true, required: true },
  lastVisit: { type: Date, default: Date.now },
});

export default mongoose.model("Visitor", visitorSchema);
