import express from "express";
import {
  addSubject,
  getSubjects,
  getSubjectsByClassController,
  getSubject,
  editSubject,
  removeSubject,
} from "../../backend/controllers/subjectController.js";

const router = express.Router();

// ➕ Create
router.post("/", addSubject);

// 📥 Read
router.get("/", getSubjects);
router.get("/class/:class_id", getSubjectsByClassController);
router.get("/:id", getSubject);

// ✏️ Update
router.put("/:id", editSubject);

// ❌ Delete
router.delete("/:id", removeSubject);

export default router;