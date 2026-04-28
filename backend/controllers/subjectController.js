import {
  createSubject,
  getAllSubjects,
  getSubjectsByClass,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../models/Subject.js";

// ➕ Add Subject
export const addSubject = async (req, res) => {
  try {
    const { name, code, class_id, teacher_id } = req.body;

    const subject = await createSubject({
      name,
      code,
      class_id,
      teacher_id,
    });

    res.status(201).json({
      message: "Subject created successfully",
      data: subject,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📥 Get all subjects
export const getSubjects = async (req, res) => {
  try {
    const subjects = await getAllSubjects();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📥 Get subjects by class
export const getSubjectsByClassController = async (req, res) => {
  try {
    const { class_id } = req.params;

    const subjects = await getSubjectsByClass(class_id);

    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📥 Get single subject
export const getSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await getSubjectById(id);

    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update subject
export const editSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await updateSubject(id, req.body);

    res.json({
      message: "Subject updated",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete subject
export const removeSubject = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteSubject(id);

    res.json({
      message: "Subject deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};