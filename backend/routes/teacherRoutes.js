import express from "express";
import {
  addTeacher,
  fetchTeachers,
  getTeacherProfile,
  getTeacherDashboard   // ✅ add this
} from "../controllers/teacherController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Add teacher
router.post("/add", addTeacher);

// 📋 Get all teachers
router.get("/", fetchTeachers);

// 👤 Teacher profile
router.get("/me", verifyToken, getTeacherProfile);

// 🎯 DASHBOARD DATA (🔥 MAIN FIX)
router.get("/dashboard-data", verifyToken, getTeacherDashboard);

export default router;