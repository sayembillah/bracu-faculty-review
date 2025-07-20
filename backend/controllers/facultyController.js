import Faculty from "../models/Faculty.js";

// GET /api/faculties - Get all faculties
export const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find({});
    res.status(200).json(faculties);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
