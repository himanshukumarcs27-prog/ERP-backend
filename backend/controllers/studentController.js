import {
  createStudent,
  getStudents,
  getStudentById
} from "../models/Student.js";


// ================= CREATE STUDENT =================
// Admin / Teacher
export const addStudent = async (req, res) => {
  try {
    const student = await createStudent({
      ...req.body,
      user_id: req.user.id // 🔥 IMPORTANT FIX
    });

    res.status(201).json({
      message: "Student created",
      student
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ================= GET ALL STUDENTS =================
export const fetchStudents = async (req, res) => {
  try {
    const students = await getStudents();

    res.json(students);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ================= GET SINGLE STUDENT =================
export const fetchStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔒 Student can only see their own data
    if (req.user.role === "student" && req.user.id !== id) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const student = await getStudentById(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json(student);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};