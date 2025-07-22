import Faculty from "../models/Faculty.js";

// POST /api/faculties - Add a new faculty (admin only)
export const addFaculty = async (req, res) => {
  try {
    const { initial, name, department, taughtCourses } = req.body;

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

    res.status(201).json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * PUT /api/faculties/:id - Update faculty (admin only)
 */
export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { initial, name, department, taughtCourses } = req.body;

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
