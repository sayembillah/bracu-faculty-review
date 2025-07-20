import Visitor from "../models/Visitor.js";

// POST /api/visitor
export const logVisitor = async (req, res) => {
  const { visitorId } = req.body;
  if (!visitorId) {
    return res.status(400).json({ message: "Missing visitorId" });
  }
  try {
    await Visitor.findOneAndUpdate(
      { visitorId },
      { lastVisit: new Date() },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: "Visitor logged" });
  } catch (err) {
    res.status(500).json({ message: "Failed to log visitor" });
  }
};
