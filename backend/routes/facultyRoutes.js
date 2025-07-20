import express from "express";
import { getAllFaculties } from "../controllers/facultyController.js";

const router = express.Router();

// GET /api/faculties - Get all faculties
router.get("/faculties", getAllFaculties);

export default router;
