import express from "express";
import { logVisitor } from "../controllers/visitorController.js";

const router = express.Router();

router.post("/visitor", logVisitor);

export default router;
